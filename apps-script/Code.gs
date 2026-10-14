// Receives competition entries from the landing and appends them to the
// sheet this script is bound to. Deploy as a Web app (Execute as: Me,
// Who has access: Anyone) and paste the /exec URL into script.js.
const HEADERS = ['Timestamp', 'First name', 'Surname', 'Email', 'Terms accepted', 'Marketing opt-in'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      String(data.firstName || ''),
      String(data.surname || ''),
      String(data.email || ''),
      data.termsAccepted === true ? 'Yes' : 'No',
      data.marketingOptIn === true ? 'Yes' : 'No'
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
