# Google Apps Script Guide — Ficcado Operations & Triggers

This document provides bound Google Apps Script utilities for **Ficcado Clothings** Google Spreadsheet (`1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs`).

---

## 1. Automated Timestamp Stamping (`onEdit`)

Add this script to the spreadsheet to automatically stamp `updated_at` whenever an admin modifies a row in `Courier Partners` or `Item Management`, and `created_at` when a new row is appended.

```javascript
/**
 * Ficcado Automated Timestamp Trigger
 * Bound to Google Spreadsheet: 1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs
 */
function onEdit(e) {
  var range = e.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  var row = range.getRow();

  // Ignore header row edits
  if (row === 1) return;

  var now = new Date();
  var istDate = Utilities.formatDate(now, "Asia/Kolkata", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  if (sheetName === "Courier Partners") {
    // Column 6: created_at, Column 7: updated_at
    var createdAtCell = sheet.getRange(row, 6);
    if (!createdAtCell.getValue()) {
      createdAtCell.setValue(istDate);
    }
    // Always update updated_at
    sheet.getRange(row, 7).setValue(istDate);
  }
}
```

---

## 2. On-Demand Catalog Cache Revalidation Webhook

When admins update prices, ratings, or review counts in `Item Management`, this trigger notifies the Next.js site to revalidate cached pages immediately without waiting for the 300s ISR window.

```javascript
function triggerNextjsRevalidate() {
  var siteUrl = "https://ficcado.store"; // or your deployment domain
  var revalidateSecret = "ficcado-revalidate-secret-2026";
  
  var url = siteUrl + "/api/revalidate?secret=" + encodeURIComponent(revalidateSecret);
  
  try {
    var response = UrlFetchApp.fetch(url, {
      method: "post",
      muteHttpExceptions: true
    });
    Logger.log("Revalidation response: " + response.getContentText());
  } catch (err) {
    Logger.log("Revalidation error: " + err.message);
  }
}
```

---

## 3. Installation Steps

1. Open the [Ficcado Google Spreadsheet](https://docs.google.com/spreadsheets/d/1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs/edit).
2. Click **Extensions** > **Apps Script**.
3. Replace the placeholder code in `Code.gs` with the script above.
4. Click **Save** (disk icon).
5. If using `triggerNextjsRevalidate`, click **Triggers** (alarm clock icon on the left panel) > **Add Trigger**:
   - Choose function: `onEdit`
   - Event source: `From spreadsheet`
   - Event type: `On edit`
   - Click **Save** and grant permissions when prompted.
