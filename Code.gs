/**
 * Google Apps Script backend untuk RSVP & ucapan.
 *
 * SETUP:
 * 1. Buat Google Sheet kosong.
 * 2. Extensions > Apps Script.
 * 3. Ganti seluruh isi Code.gs dengan kode ini.
 * 4. Jalankan setupSheet() sekali dan berikan izin.
 * 5. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone (dibutuhkan agar tamu dapat mengirim RSVP)
 * 6. Salin URL Web app /exec ke appsScriptUrl di config.js.
 *
 * Catatan: endpoint publik dapat menerima kiriman dari siapa saja. Jangan simpan
 * data sensitif. Tambahkan validasi/rate limiting jika digunakan dalam skala besar.
 */

const SHEET_NAME = "RSVP";

function doGet() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return jsonOutput_([]);
  const rows = values.slice(1).filter(row => row[0]).map(row => ({
    timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
    name: String(row[1] || ""),
    attendance: String(row[2] || ""),
    guestCount: Number(row[3] || 1),
    message: String(row[4] || "")
  }));
  return jsonOutput_(rows);
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) return jsonOutput_({ ok: false, error: "Empty request body" });
    const payload = JSON.parse(raw);

    const name = cleanText_(payload.name, 100);
    const attendance = cleanText_(payload.attendance, 30);
    const guestCount = Math.max(1, Math.min(4, Number(payload.guestCount) || 1));
    const message = cleanText_(payload.message, 1000);
    const allowed = ["Hadir", "Tidak Hadir", "Ragu"];

    if (!name || !message || !allowed.includes(attendance)) {
      return jsonOutput_({ ok: false, error: "Invalid fields" });
    }

    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, attendance, guestCount, message]);
    return jsonOutput_({ ok: true });
  } catch (error) {
    return jsonOutput_({ ok: false, error: String(error) });
  }
}

function setupSheet() {
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Nama", "Kehadiran", "Jumlah Tamu", "Ucapan"]);
    sheet.setFrozenRows(1);
  }
  return "Sheet siap: " + sheet.getName();
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Buka Apps Script dari Google Sheet yang benar.");
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Nama", "Kehadiran", "Jumlah Tamu", "Ucapan"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function cleanText_(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function jsonOutput_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
