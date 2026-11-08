
const SHEET_NAME = "RSVP";

// Membaca data ucapan dari Google Sheets
function doGet(e) {
  try {
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    let data = [];

    if (lastRow > 1) {
      const rows = sheet.getRange(2, 1, lastRow - 1, 5).getValues();

      data = rows
        .filter(row => row[0])
        .map(row => ({
          name: String(row[0] || ""),
          attendance: String(row[1] || ""),
          guestCount: Number(row[2] || 1),
          message: String(row[3] || ""),
          submittedAt: row[4] instanceof Date
            ? row[4].toISOString()
            : String(row[4] || "")
        }));
    }

    const output = JSON.stringify(data);
    const callback = e && e.parameter && e.parameter.callback;

    // JSONP agar daftar ucapan dapat dibaca dari website lintas domain
    if (callback && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(callback)) {
      return ContentService
        .createTextOutput(callback + "(" + output + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return jsonOutput_(data);

  } catch (error) {
    return jsonOutput_({
      success: false,
      error: String(error)
    });
  }
}

// Menyimpan RSVP
function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) throw new Error("Data RSVP kosong");

    const payload = JSON.parse(raw);

    const name = cleanText_(payload.name, 100);
    const attendance = cleanText_(payload.attendance, 30);
    const guestCount = Math.max(
      1,
      Math.min(4, Number(payload.guestCount) || 1)
    );
    const message = cleanText_(payload.message, 1000);

    const allowed = ["Hadir", "Tidak Hadir", "Ragu"];

    if (!name || !allowed.includes(attendance)) {
      throw new Error("Nama atau konfirmasi kehadiran tidak valid");
    }

    const sheet = getSheet_();

    // Urutan kolom mengikuti spreadsheet:
    // Nama | Kehadiran | Jumlah Tamu | Ucapan | Waktu Kirim
    sheet.appendRow([
      name,
      attendance,
      guestCount,
      message,
      new Date()
    ]);

    return jsonOutput_({ success: true });

  } catch (error) {
    return jsonOutput_({
      success: false,
      error: String(error)
    });
  }
}

// Memastikan sheet dan header tersedia
function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("Spreadsheet tidak ditemukan");
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Nama",
      "Kehadiran",
      "Jumlah Tamu",
      "Ucapan",
      "Waktu Kirim"
    ]);
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
