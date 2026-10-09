# Data Governance, Access Control & Backup Routine (B-28) — Ficcado

**Purpose:** Comprehensive operational guide for spreadsheet datastore access control, data retention rules per Decision D15, and automated disaster recovery routines.  
**Audience:** Founders (Sinan MS, Ganga Lakshmi, Rohith Murali), Technical Lead (`Arjun PS`)  
**Target Spreadsheet:** `fic-quick-website-data`

---

## 1. Access Control & Authorization List

To protect customer information and order integrity, the production Google Spreadsheet must maintain the following strict permission boundaries:

| Entity | Identity | Role / Access Level | Authentication & Security Controls |
|---|---|---|---|
| **Web Application Backend** | `ficcado-quick-webapp@ficcado-quick-website.iam.gserviceaccount.com` | **Editor** (API writes & reads) | Authenticates via RS256 JWT using private key stored securely in Netlify environment variables (`GOOGLE_PRIVATE_KEY`). |
| **Order Gateway Web App** | Deployed Google Apps Script | **Editor** (Atomic Reference ID & Counter) | Executes within Google workspace context via `LockService` and `PropertiesService`. |
| **Operations & Finance** | `rohithficcado@gmail.com` (Rohith Murali, POG) | **Editor** (Fulfillment & Status Updates) | 2-Step Verification (2FA / Google Prompt) mandatory. |
| **Creative & Operations** | Ganga Lakshmi | **Editor** (Product Management & Catalog) | 2-Step Verification (2FA) mandatory. |
| **Executive / Admin** | `ficcado.clothing@gmail.com` (Sinan MS, CEO) | **Owner** (Spreadsheet Owner) | 2-Step Verification (2FA) mandatory with hardware key / Authenticator app. |
| **General Public** | All other users | **RESTRICTED (No Access)** | Link sharing must be set to **Restricted** (Never *"Anyone with the link"*). |

### Security Audit Checklist for Sheet Owner:
- [ ] Confirm link sharing is set to **Restricted**.
- [ ] Ensure only authorized founder email addresses are in the collaborator list.
- [ ] Protect tab headers: Row 1 of all 4 tabs (`Item Management`, `Courier Partners`, `New Sale Request`, `Support Requests`) should be protected with *Show a warning when editing this range*.
- [ ] Protect column A (`reference_id`) in `New Sale Request`: prevent manual edits to Reference IDs.

---

## 2. Customer Data Retention Plan (Decision D15)

In accordance with business decisions finalized in Decision D15:

1. **Retention Period:** Order records, customer contact information, and support requests are **retained indefinitely ("forever safe")** in our encrypted administrative data store to support:
   - Lifetime order lookups and proof-of-purchase verification.
   - Sizing replacements, return handling, and warranty resolution.
   - Tax, accounting, and statutory financial reporting under Indian commercial regulations.
2. **Storage Minimization:**
   - In-flight browser checkout form drafts (`ficcado-checkout-form-draft`) are automatically purged from browser storage immediately upon confirmed order placement.
   - If a customer rejects non-essential storage in the Cookie Consent Banner, form auto-saving and storefront search history are disabled.
3. **Third-Party Logistics Sharing:**
   - Customer phone numbers and addresses are **never shared digitally via third-party database APIs** with courier partners.
   - Only the physical shipping label pasted onto the exterior shipping box is provided to the courier delivery agent.

---

## 3. Automated Backup & Disaster Recovery Routine

To ensure zero data loss during high concurrency or accidental spreadsheet edits:

### 3.1 Google Drive Revision History (Real-Time)
Google Sheets maintains built-in continuous version history:
1. Open the spreadsheet → click **File** → **Version history** → **See version history**.
2. Any row deletion or formatting issue can be rolled back to any point in time with one click.

### 3.2 Automated Daily Snapshot Script (Google Apps Script)
Add this daily time-driven trigger to the Apps Script project to automatically create timestamped daily backup copies in a dedicated Google Drive folder:

```javascript
/**
 * Daily Automated Backup Routine for Ficcado Sheets Datastore
 * Setup: Triggers -> Add Trigger -> createDailyBackup -> Time-driven -> Day timer (2:00 AM)
 */
function createDailyBackup() {
  var spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  var file = DriveApp.getFileById(spreadsheetId);
  
  // Find or create 'Ficcado Datastore Backups' folder
  var folderName = 'Ficcado Datastore Backups';
  var folders = DriveApp.getFoldersByName(folderName);
  var backupFolder;
  if (folders.hasNext()) {
    backupFolder = folders.next();
  } else {
    backupFolder = DriveApp.createFolder(folderName);
  }
  
  var dateStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd_HH-mm");
  var backupFileName = 'ficcado-data-backup-' + dateStr;
  
  file.makeCopy(backupFileName, backupFolder);
  Logger.log('Successfully created backup: ' + backupFileName);
}
```

### 3.3 Off-Site Snapshot Routine
- Weekly manual download of `New Sale Request` and `Item Management` tabs in `.csv` or `.xlsx` format to secure encrypted local storage.
