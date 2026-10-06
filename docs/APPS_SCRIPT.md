# Google Apps Script Order Gateway — Setup & Deployment Guide

This document contains the production Google Apps Script deployment code for **Ficcado** per Decision D1.

---

## 1. Architecture & Concurrency Guarantees

Google Sheets API does not offer native atomic counter increments or transactions during batch appends. When two concurrent orders arrive simultaneously, direct Sheets API reads can see the same maximum ID, resulting in duplicate reference numbers.

This Google Apps Script Web App solves the issue using:
1. **`LockService.getScriptLock()`**: Serializes order submissions. Each incoming request waits up to 10 seconds for the lock, guaranteeing strictly atomic execution.
2. **`PropertiesService.getScriptProperties()`**: Maintains the sequential counter atomically in persistent script storage.
3. **Idempotency on `submission_id`**: Stores recent submission IDs to prevent duplicate order placement if a customer double-clicks or retries.
4. **Dynamic Header Resolution**: Maps order fields to spreadsheet columns by header name, ensuring resilience against column reordering.

---

## 2. Copy-Paste Apps Script Code

Copy the code below into a new Google Apps Script project bound to your Google Spreadsheet:

1. Open the Ficcado Google Sheet in your browser.
2. Go to **Extensions > Apps Script**.
3. Replace the content of `Code.gs` with the following:

```javascript
// =============================================================================
// Ficcado Order Gateway — Google Apps Script Web App
// Atomic Reference ID + Idempotency + Dynamic Header Append
// =============================================================================

var GATEWAY_SECRET = PropertiesService.getScriptProperties().getProperty('ORDER_GATEWAY_SECRET') || 'CHANGE_THIS_SECRET';

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = false;

  try {
    // 1. Acquire script lock (wait up to 10 seconds)
    hasLock = lock.waitLock(10000);
    if (!hasLock) {
      return jsonResponse({
        success: false,
        error: 'LOCK_TIMEOUT',
        message: 'Order processor busy. Please retry shortly.'
      }, 503);
    }

    // 2. Parse payload
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'BAD_REQUEST', message: 'Missing request body' }, 400);
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse({ success: false, error: 'INVALID_JSON', message: 'Malformed JSON payload' }, 400);
    }

    // 3. Authenticate secret in request body
    if (!payload.secret || payload.secret !== GATEWAY_SECRET) {
      return jsonResponse({ success: false, error: 'UNAUTHORIZED', message: 'Invalid gateway secret' }, 401);
    }

    var submissionId = payload.submission_id;
    if (!submissionId) {
      return jsonResponse({ success: false, error: 'MISSING_SUBMISSION_ID', message: 'submission_id is required' }, 400);
    }

    var props = PropertiesService.getScriptProperties();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('New Sale Request');
    if (!sheet) {
      return jsonResponse({ success: false, error: 'SHEET_NOT_FOUND', message: '"New Sale Request" tab not found' }, 500);
    }

    // 4. Check Idempotency (submission_id cache)
    var cacheKey = 'sub_' + submissionId;
    var existingRef = props.getProperty(cacheKey);
    if (existingRef) {
      return jsonResponse({
        success: true,
        referenceId: existingRef,
        duplicate: true,
        message: 'Order already processed'
      }, 200);
    }

    // 5. Atomic Reference ID Generation
    var currentLetter = props.getProperty('CURRENT_LETTER') || 'A';
    var currentSeq = parseInt(props.getProperty('CURRENT_SEQ') || '1000', 10);

    currentSeq++;
    if (currentSeq > 9999) {
      currentSeq = 1001;
      currentLetter = nextLetterSeries(currentLetter);
      props.setProperty('CURRENT_LETTER', currentLetter);
    }
    props.setProperty('CURRENT_SEQ', currentSeq.toString());

    var referenceId = 'FIC-' + currentLetter + currentSeq;

    // 6. Map payload fields to row values by column header
    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var rowData = payload.rowData || {};
    rowData['reference_id'] = referenceId;
    rowData['submission_id'] = submissionId;
    rowData['order_time'] = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a');

    var newRow = headerRow.map(function(header) {
      var key = String(header).trim().toLowerCase();
      var val = rowData[key];
      if (val === undefined || val === null) return '';
      // Formula injection protection
      var strVal = String(val);
      if (/^[=\+\-\@\t\r]/.test(strVal)) {
        return "'" + strVal;
      }
      return val;
    });

    // 7. Append row
    sheet.appendRow(newRow);

    // 8. Store idempotency record
    props.setProperty(cacheKey, referenceId);

    return jsonResponse({
      success: true,
      referenceId: referenceId,
      duplicate: false
    }, 200);

  } catch (err) {
    return jsonResponse({
      success: false,
      error: 'INTERNAL_ERROR',
      message: err.toString()
    }, 500);
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

function nextLetterSeries(letters) {
  var chars = letters.split('');
  var i = chars.length - 1;
  while (i >= 0) {
    if (chars[i] < 'Z') {
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
      return chars.join('');
    }
    chars[i] = 'A';
    i--;
  }
  return 'A' + chars.join('');
}

function jsonResponse(data, status) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## 3. Configuration Steps

1. In Apps Script, go to **Project Settings > Script Properties**.
2. Add Property:
   - **Property:** `ORDER_GATEWAY_SECRET`
   - **Value:** `[A strong 32+ character random string]`
   - *(Optional Initial Values)*:
     - `CURRENT_LETTER`: `A`
     - `CURRENT_SEQ`: `1000`
3. Click **Deploy > New Deployment**:
   - Type: **Web app**
   - Description: `Ficcado Order Gateway v1`
   - Execute as: **Me (your Google account)**
   - Who has access: **Anyone**
4. Copy the Web app URL (e.g., `https://script.google.com/macros/s/.../exec`).
5. Set environment variables in your deployment / `.env.local`:
   ```bash
   ORDER_GATEWAY_URL="https://script.google.com/macros/s/AKfycb.../exec"
   ORDER_GATEWAY_SECRET="[your chosen secret]"
   ```
