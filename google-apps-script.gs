function doPost(e) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('RSVP');

  if (!sheet) {
    throw new Error('RSVP 시트를 찾을 수 없습니다.');
  }

  const data = JSON.parse(e.postData.contents || '{}');

  sheet.appendRow([
    new Date(),
    data.side || '',
    data.attendance || '',
    data.meal || '',
    data.name || '',
    data.phone || '',
    Number(data.companions || 0)
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
