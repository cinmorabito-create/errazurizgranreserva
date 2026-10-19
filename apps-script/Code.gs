// Receives competition entries from the landing and appends them to the
// sheet this script is bound to. Deploy as a Web app (Execute as: Me,
// Who has access: Anyone) and paste the /exec URL into script.js.
const HEADERS = [
  'Timestamp', 'First name', 'Surname', 'Date of birth', 'Email', 'Phone',
  'Address line 1', 'Address line 2', 'Town or city', 'Postcode',
  'Terms accepted', 'Marketing opt-in'
];

// The leading apostrophe keeps Sheets from reading entries as formulas or
// numbers, which would drop a phone number's leading 0 or run "+44…".
const text = (value) => "'" + String(value || '');

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      text(data.firstName),
      text(data.surname),
      text(data.dob),
      text(data.email),
      text(data.phone),
      text(data.addressLine1),
      text(data.addressLine2),
      text(data.town),
      text(data.postcode),
      data.termsAccepted === true ? 'Yes' : 'No',
      data.marketingOptIn === true ? 'Yes' : 'No'
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
