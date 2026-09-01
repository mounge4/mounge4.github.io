/**
 * Google Sheet URL & ID provided by the user:
 * URL: https://docs.google.com/spreadsheets/d/17mdkrESry8i2qZ0nOh7arklYz_62bbqs2DGldgCWybc/edit?usp=drivesdk
 * ID: 17mdkrESry8i2qZ0nOh7arklYz_62bbqs2DGldgCWybc
 */
export const TARGET_SPREADSHEET_ID = "17mdkrESry8i2qZ0nOh7arklYz_62bbqs2DGldgCWybc";
export const TARGET_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/17mdkrESry8i2qZ0nOh7arklYz_62bbqs2DGldgCWybc/edit?usp=drivesdk";
export const DEFAULT_DEPLOYED_APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzKn-kLNTL-5KZojCg9m9Uca0YmrgMrF3-MCgJy3Ik00Rfee-G01Grqp2rxa31UNfwziA/exec";

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================================
 * স্টেশন পাড়া দাওয়াহ্ কমিউনিটি - Google Apps Script Backend (Code.gs)
 * =========================================================================================
 * স্প্রেডশীট লিংক: https://docs.google.com/spreadsheets/d/17mdkrESry8i2qZ0nOh7arklYz_62bbqs2DGldgCWybc/edit?usp=drivesdk
 * স্প্রেডশীট আইডি: 17mdkrESry8i2qZ0nOh7arklYz_62bbqs2DGldgCWybc
 * 
 * গুরুত্বপূর্ণ বৈশিষ্ট্যসমূহ:
 * ১. getSheet (গেট শীট): কোনো শীট না থাকলে স্বয়ংক্রিয়ভাবে নতুন ট্যাব তৈরি করে।
 * ২. setupSheet (সেটআপ শীট): রো ১-এ সরাসরি কলাম হেডার (Headers) বসিয়ে দেয়, বোল্ড ও সবুজ ব্যাকগ্রাউন্ড করে এবং ১ম রো ফ্রিজ করে।
 * ৩. setupInitialSheets: ১৪টি শীটের হেডার ও সেটিংস ১ ক্লিকে গ্যারান্টিসহ তৈরি করে।
 * ৪. doGet ও doPost: রিয়েল-টাইম ডাটা সিঙ্ক ও ব্যাকএন্ড রিকোয়েস্ট হ্যান্ডলিং।
 * =========================================================================================
 */

var SPREADSHEET_ID = "17mdkrESry8i2qZ0nOh7arklYz_62bbqs2DGldgCWybc";

/**
 * স্প্রেডশীট অবজেক্ট পাওয়ার ফাংশন
 */
function getTargetSpreadsheet() {
  try {
    var activeSS = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSS) return activeSS;
  } catch (e) {}

  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim().length > 5) {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    }
  } catch (e) {
    Logger.log("ID দিয়ে ওপেন করতে সমস্যা: " + e.toString());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * =========================================================================================
 * ১. getSheet (গেট শীট) ফাংশন
 * স্প্রেডশীটে কোনো শীট থাকলে ফেরত দেয়, আর না থাকলে স্বয়ংক্রিয়ভাবে তৈরি করে দেয়।
 * =========================================================================================
 */
function getSheet(ss, sheetName) {
  if (!ss) {
    ss = getTargetSpreadsheet();
  }
  if (!sheetName) return null;
  
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

// এলিয়াস ফাংশন
function getOrCreateSheet(ss, sheetName) {
  return getSheet(ss, sheetName);
}

/**
 * =========================================================================================
 * ২. setupSheet (সেটআপ শীট) ফাংশন
 * যেকোনো শীটের রো ১-এ সরাসরি কলাম হেডার রাইট করে, বোল্ড, সবুজ ব্যাকগ্রাউন্ড ও ফ্রিজ করে।
 * =========================================================================================
 */
function setupSheet(ss, sheetName, headers) {
  if (!ss) {
    ss = getTargetSpreadsheet();
  }
  var sheet = getSheet(ss, sheetName);
  if (!sheet || !headers || headers.length === 0) return sheet;

  // সরাসরি রো ১-এ কলাম হেডার বসানো
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // হেডারের ডিজাইন ও স্টাইলিং (গাঢ় সবুজ ব্যাকগ্রাউন্ড ও সাদা টেক্সট)
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold")
             .setBackground("#059669")
             .setFontColor("#ffffff")
             .setHorizontalAlignment("center");

  try {
    sheet.setFrozenRows(1);
  } catch (e) {}

  return sheet;
}

function setupSheetHeaders(ss, sheetName, headers) {
  return setupSheet(ss, sheetName, headers);
}

/**
 * =========================================================================================
 * ৩. setupInitialSheets (মাস্টার ইনিশিয়ালাইজার ফাংশন)
 * এই ফাংশনটি রান (Run) করলে ১৪টি শীট এবং তাদের কলাম হেডার নিশ্চিতভাবে তৈরি ও সেট হয়ে যাবে।
 * =========================================================================================
 */
function setupInitialSheets() {
  var ss = getTargetSpreadsheet();
  if (!ss) {
    throw new Error("স্প্রেডশীট ওপেন করা যায়নি। স্প্রেডশীট আইডি বা পারমিশন চেক করুন।");
  }

  // ১. Settings শীট
  var settingsSheet = getSheet(ss, "Settings");
  settingsSheet.getRange("A1:B1").setValues([["Key", "Value"]]);
  settingsSheet.getRange("A1:B1")
    .setFontWeight("bold")
    .setBackground("#059669")
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");
  try {
    settingsSheet.setFrozenRows(1);
  } catch (e) {}

  if (settingsSheet.getLastRow() <= 1) {
    var defaultSettings = [
      ["foundationName", "স্টেশন পাড়া দাওয়াহ্ কমিউনিটি"],
      ["slogan", "দ্বীনের দাওয়াহ, ভ্রাতৃত্ব ও মানবসেবায় নিয়োজিত"],
      ["regNumber", "রেজি নং: IDF-২০২৪/০৯৮৭"],
      ["establishedYear", "২০২০"],
      ["phone", "+৮৮০১৭১২-৩৪৫৬৭৮"],
      ["altPhone", "+৮৮০১৯৮৭-৬৫৪৩২১"],
      ["email", "contact@islamicdharahfoundation.org"],
      ["address", "নীলফামারী পুরাতন রেলওয়ে স্টেশন, নীলফামারী সদর-৫৩০০,নীলফামারী, বাংলাদেশ"],
      ["whatsapp", "+8801700000000"],
      ["facebookUrl", "https://facebook.com"],
      ["youtubeUrl", "https://youtube.com"],
      ["telegramUrl", "https://t.me"],
      ["adminPassword", "admin"],
      ["primaryColor", "#059669"],
      ["secondaryColor", "#d97706"],
      ["headingTextColor", "#022c22"],
      ["bodyTextColor", "#334155"],
      ["cardBgColor", "#ffffff"],
      ["cardBorderColor", "#e2e8f0"],
      ["pageBgColor", "#f8fafc"],
      ["headerBgColor", "#ffffff"],
      ["footerBgColor", "#022c22"],
      ["missionQuote", "এই প্রতিষ্ঠান মানবতার শিক্ষক, মানুষের মুক্তি ও শান্তির দূত, মানবসেবার আদর্শ, মহানবী মুহাম্মদ সা.-এর পদাঙ্ক অনুসরণ করে আর্তমানবতার সেবায় একটি আদর্শ কল্যাণসমাজ বিনির্মাণে সর্বদা নিয়োজিত।"],
      ["bkashNumber", "০১৭০০-১২৩৪৫৬ (মার্চেন্ট - পেমেন্ট)"],
      ["nagadNumber", "০১৮০০-১২৩৪৫৬ (মার্চেন্ট)"],
      ["rocketNumber", "০১৭০০-১২৩৪৫৬-৭"],
      ["bankName", "ইসলামী ব্যাংক বাংলাদেশ পিএলসি"],
      ["bankAccountName", "ইসলামী ধারার ফাউন্ডেশন"],
      ["bankAccountNumber", "২০৫০১২৩৪৫৬৭৮৯০০"],
      ["bankBranch", "ধানমন্ডি শাখা, ঢাকা"],
      ["bankRouting", "১২৫২৬০৯৮৭"]
    ];
    settingsSheet.getRange(2, 1, defaultSettings.length, 2).setValues(defaultSettings);
  }

  // ২. Slides শীট
  setupSheet(ss, "Slides", ["id", "title", "subtitle", "imageUrl", "videoUrl", "ctaText", "ctaLink", "order", "active"]);

  // ৩. Notices শীট
  setupSheet(ss, "Notices", ["id", "title", "description", "date", "category", "isImportant", "fileUrl", "linkUrl", "active"]);

  // ৪. Activities শীট
  setupSheet(ss, "Activities", ["id", "title", "category", "shortDesc", "fullDesc", "imageUrl", "videoUrl", "targetAmount", "raisedAmount", "beneficiariesCount", "status", "location", "date", "featured"]);

  // ৫. Blogs শীট
  setupSheet(ss, "Blogs", ["id", "title", "slug", "excerpt", "content", "author", "authorRole", "date", "category", "imageUrl", "videoUrl", "tags", "readTime", "views"]);

  // ৬. Members শীট
  setupSheet(ss, "Members", ["id", "name", "designation", "category", "photoUrl", "bio", "phone", "email", "order", "active"]);

  // ৭. Gallery শীট
  setupSheet(ss, "Gallery", ["id", "title", "category", "imageUrl", "images", "videoUrl", "date", "location", "description"]);

  // ৮. CustomFields শীট
  setupSheet(ss, "CustomFields", ["id", "formType", "label", "fieldType", "placeholder", "required", "options", "order", "active"]);

  // ৯. Volunteers শীট
  setupSheet(ss, "Volunteers", ["id", "fullName", "phone", "email", "address", "division", "district", "profession", "bloodGroup", "interestArea", "message", "extraAnswers", "joinedDate", "status"]);

  // ১০. Messages শীট
  setupSheet(ss, "Messages", ["id", "name", "phone", "email", "subject", "message", "extraAnswers", "date", "status"]);

  // ১১. Donations শীট
  setupSheet(ss, "Donations", ["id", "donorName", "phone", "amount", "paymentMethod", "transactionId", "purpose", "extraAnswers", "date", "verified"]);

  // ১২. BotQnA শীট
  setupSheet(ss, "BotQnA", ["id", "question", "answer", "category", "quickMenu", "order", "active"]);

  // ১৩. SocialLinks শীট
  setupSheet(ss, "SocialLinks", ["id", "platform", "title", "url", "badgeText", "icon", "order", "active"]);

  // ১৪. MissionQuotes শীট (উক্তি, হাদীস ও কুরআনের আয়াত স্লাইডার)
  setupSheet(ss, "MissionQuotes", ["id", "category", "quote", "arabicText", "source", "order", "active"]);

  // ডিফল্ট খালি Sheet1 থাকলে ক্লিন করা
  try {
    var defaultSheet1 = ss.getSheetByName("Sheet1") || ss.getSheetByName("শীট১");
    if (defaultSheet1 && ss.getSheets().length > 1) {
      if (defaultSheet1.getLastRow() === 0) {
        ss.deleteSheet(defaultSheet1);
      }
    }
  } catch (e) {}

  SpreadsheetApp.flush();
  Logger.log("✅ সকল ১৪টি শীট ও কলাম হেডার সফলভাবে প্রস্তুত ও স্টাইল করা হয়েছে!");
}

/**
 * =========================================================================================
 * ৪. GET রিকোয়েস্ট হ্যান্ডলার (doGet)
 * =========================================================================================
 */
function doGet(e) {
  try {
    var ss = getTargetSpreadsheet();

    var data = {
      settings: getSheetDataAsObject(ss, "Settings"),
      slides: getSheetDataAsList(ss, "Slides"),
      notices: getSheetDataAsList(ss, "Notices"),
      activities: getSheetDataAsList(ss, "Activities"),
      blogs: getSheetDataAsList(ss, "Blogs"),
      gallery: getSheetDataAsList(ss, "Gallery"),
      members: getSheetDataAsList(ss, "Members"),
      customFields: getSheetDataAsList(ss, "CustomFields"),
      volunteers: getSheetDataAsList(ss, "Volunteers"),
      messages: getSheetDataAsList(ss, "Messages"),
      donations: getSheetDataAsList(ss, "Donations"),
      botQnA: getSheetDataAsList(ss, "BotQnA"),
      socialLinks: getSheetDataAsList(ss, "SocialLinks"),
      missionQuotes: getSheetDataAsList(ss, "MissionQuotes"),
      lastSyncedAt: new Date().toISOString()
    };

    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * =========================================================================================
 * ৫. POST রিকোয়েস্ট হ্যান্ডলার (doPost)
 * =========================================================================================
 */
function doPost(e) {
  try {
    var ss = getTargetSpreadsheet();

    var contents;
    if (e.postData && e.postData.contents) {
      contents = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      contents = e.parameter;
    } else {
      contents = {};
    }

    var action = contents.action || "syncAll";
    var payload = contents.payload;

    if (action === "syncAll") {
      if (payload.settings) saveSettings(ss, payload.settings);
      if (payload.slides !== undefined) saveArrayToSheet(ss, "Slides", payload.slides);
      if (payload.notices !== undefined) saveArrayToSheet(ss, "Notices", payload.notices);
      if (payload.activities !== undefined) saveArrayToSheet(ss, "Activities", payload.activities);
      if (payload.blogs !== undefined) saveArrayToSheet(ss, "Blogs", payload.blogs);
      if (payload.gallery !== undefined) saveArrayToSheet(ss, "Gallery", payload.gallery);
      if (payload.members !== undefined) saveArrayToSheet(ss, "Members", payload.members);
      if (payload.volunteers !== undefined) saveArrayToSheet(ss, "Volunteers", payload.volunteers);
      if (payload.messages !== undefined) saveArrayToSheet(ss, "Messages", payload.messages);
      if (payload.donations !== undefined) saveArrayToSheet(ss, "Donations", payload.donations);
      if (payload.customFields !== undefined) saveArrayToSheet(ss, "CustomFields", payload.customFields);
      if (payload.botQnA !== undefined) saveArrayToSheet(ss, "BotQnA", payload.botQnA);
      if (payload.socialLinks !== undefined) saveArrayToSheet(ss, "SocialLinks", payload.socialLinks);
      if (payload.missionQuotes !== undefined) saveArrayToSheet(ss, "MissionQuotes", payload.missionQuotes);
    } else if (action === "addVolunteer") {
      appendRowToSheet(ss, "Volunteers", payload);
    } else if (action === "addMessage") {
      appendRowToSheet(ss, "Messages", payload);
    } else if (action === "addDonation") {
      appendRowToSheet(ss, "Donations", payload);
    } else if (action === "saveVolunteers") {
      saveArrayToSheet(ss, "Volunteers", payload);
    } else if (action === "saveMessages") {
      saveArrayToSheet(ss, "Messages", payload);
    } else if (action === "saveDonations") {
      saveArrayToSheet(ss, "Donations", payload);
    } else if (action === "updateSettings") {
      saveSettings(ss, payload);
    } else if (action === "saveNotices") {
      saveArrayToSheet(ss, "Notices", payload);
    } else if (action === "saveBlogs") {
      saveArrayToSheet(ss, "Blogs", payload);
    } else if (action === "saveActivities") {
      saveArrayToSheet(ss, "Activities", payload);
    } else if (action === "saveMembers") {
      saveArrayToSheet(ss, "Members", payload);
    } else if (action === "saveSlides") {
      saveArrayToSheet(ss, "Slides", payload);
    } else if (action === "saveGallery") {
      saveArrayToSheet(ss, "Gallery", payload);
    } else if (action === "saveCustomFields") {
      saveArrayToSheet(ss, "CustomFields", payload);
    } else if (action === "saveMissionQuotes") {
      saveArrayToSheet(ss, "MissionQuotes", payload);
    } else if (action === "saveBotQnA") {
      saveArrayToSheet(ss, "BotQnA", payload);
    } else if (action === "saveSocialLinks") {
      saveArrayToSheet(ss, "SocialLinks", payload);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "গুগল শিটে ডাটা সফলভাবে সংরক্ষিত হয়েছে!",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * =========================================================================================
 * ৬. getSheetDataAsObject
 * =========================================================================================
 */
function getSheetDataAsObject(ss, sheetName) {
  try {
    var sheet = getSheet(ss, sheetName);
    if (!sheet) return {};
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow <= 1 || lastCol === 0) return {};

    var numCols = Math.max(lastCol, 2);
    var data = sheet.getRange(1, 1, lastRow, numCols).getValues();
    if (!data || data.length <= 1) return {};

    var obj = {};
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row || row.length === 0) continue;
      var rawKey = row[0];
      if (rawKey === null || rawKey === undefined) continue;
      var key = rawKey.toString().trim();
      if (!key || key.toLowerCase() === "key") continue;

      var val = row[1];
      if (val === undefined || val === null) {
        val = "";
      } else if (val === "TRUE" || val === true) {
        val = true;
      } else if (val === "FALSE" || val === false) {
        val = false;
      } else if (typeof val === "string") {
        var trimmed = val.trim();
        if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
          try {
            val = JSON.parse(trimmed);
          } catch (e) {}
        }
      }
      obj[key] = val;
    }
    return obj;
  } catch (err) {
    Logger.log("Error in getSheetDataAsObject: " + err.toString());
    return {};
  }
}

/**
 * =========================================================================================
 * ৭. getSheetDataAsList
 * =========================================================================================
 */
function getSheetDataAsList(ss, sheetName) {
  try {
    var sheet = getSheet(ss, sheetName);
    if (!sheet) return [];
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow <= 1 || lastCol === 0) return [];

    var data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    if (!data || data.length <= 1) return [];

    var rawHeaders = data[0];
    var headers = [];
    for (var h = 0; h < rawHeaders.length; h++) {
      var hVal = rawHeaders[h];
      headers.push(hVal !== null && hVal !== undefined ? hVal.toString().trim() : "");
    }

    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row || row.length === 0) continue;

      var isAllEmpty = true;
      for (var c = 0; c < row.length; c++) {
        var cell = row[c];
        if (cell !== "" && cell !== null && cell !== undefined) {
          isAllEmpty = false;
          break;
        }
      }
      if (isAllEmpty) continue;

      var item = {};
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        if (!key) continue;

        var val = row[j];
        if (val === undefined || val === null) {
          item[key] = "";
        } else if (val === "TRUE" || val === true) {
          item[key] = true;
        } else if (val === "FALSE" || val === false) {
          item[key] = false;
        } else if (typeof val === "string") {
          var trimmed = val.trim();
          if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
            try {
              item[key] = JSON.parse(trimmed);
            } catch (e) {
              item[key] = val;
            }
          } else {
            item[key] = val;
          }
        } else if (val instanceof Date) {
          item[key] = val.toISOString().split("T")[0];
        } else {
          item[key] = val;
        }
      }
      list.push(item);
    }
    return list;
  } catch (err) {
    Logger.log("Error in getSheetDataAsList: " + err.toString());
    return [];
  }
}

function getSheetDataAsArray(ss, sheetName) {
  return getSheetDataAsList(ss, sheetName);
}

/**
 * =========================================================================================
 * ৮. appendRowToSheet
 * =========================================================================================
 */
function appendRowToSheet(ss, sheetName, dataOrObj) {
  try {
    var sheet = getSheet(ss, sheetName);
    if (!sheet) return;

    var lastCol = sheet.getLastColumn();
    var finalRowArray = [];

    if (Array.isArray(dataOrObj)) {
      finalRowArray = dataOrObj.map(function(val) {
        if (val === null || val === undefined) return "";
        if (typeof val === "object") return JSON.stringify(val);
        return val;
      });
    } else if (typeof dataOrObj === "object" && dataOrObj !== null) {
      if (lastCol > 0) {
        var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) {
          return h !== null && h !== undefined ? h.toString().trim() : "";
        });
        
        finalRowArray = headers.map(function(h) {
          var val = dataOrObj[h];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return JSON.stringify(val);
          return val;
        });
      } else {
        finalRowArray = Object.keys(dataOrObj).map(function(k) {
          var val = dataOrObj[k];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return JSON.stringify(val);
          return val;
        });
      }
    } else {
      finalRowArray = [dataOrObj !== undefined && dataOrObj !== null ? dataOrObj : ""];
    }

    if (finalRowArray && finalRowArray.length > 0) {
      sheet.appendRow(finalRowArray);
    }
  } catch (err) {
    Logger.log("Error in appendRowToSheet: " + err.toString());
  }
}

/**
 * =========================================================================================
 * ৯. saveSettings ও saveArrayToSheet
 * =========================================================================================
 */
function saveSettings(ss, settingsObj) {
  try {
    var sheet = getSheet(ss, "Settings");
    if (!sheet) return;
    sheet.clear();
    sheet.appendRow(["Key", "Value"]);
    sheet.getRange("A1:B1")
      .setFontWeight("bold")
      .setBackground("#059669")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");
    try {
      sheet.setFrozenRows(1);
    } catch (e) {}

    var entries = Object.keys(settingsObj).map(function(k) {
      var v = settingsObj[k];
      if (typeof v === "object" && v !== null) v = JSON.stringify(v);
      return [k, v !== undefined ? v : ""];
    });
    if (entries.length > 0) {
      sheet.getRange(2, 1, entries.length, 2).setValues(entries);
    }
  } catch (err) {
    Logger.log("Error in saveSettings: " + err.toString());
  }
}

function saveArrayToSheet(ss, sheetName, items) {
  try {
    if (!items || !Array.isArray(items)) return;
    var sheet = getSheet(ss, sheetName);
    if (!sheet) return;

    if (items.length === 0) {
      var lastRow = sheet.getLastRow();
      var lastCol = sheet.getLastColumn();
      if (lastRow > 1 && lastCol > 0) {
        sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
      }
      return;
    }

    sheet.clear();
    var headers = Object.keys(items[0]);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#059669")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");
    try {
      sheet.setFrozenRows(1);
    } catch (e) {}
    
    var rows = items.map(function(item) {
      return headers.map(function(h) {
        var val = item[h];
        if (Array.isArray(val)) return JSON.stringify(val);
        if (typeof val === "object" && val !== null) return JSON.stringify(val);
        return val !== undefined ? val : "";
      });
    });

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
  } catch (err) {
    Logger.log("Error in saveArrayToSheet: " + err.toString());
  }
}
`;

export const APPS_SCRIPT_GUIDE_STEPS = [
  {
    step: "১",
    title: "গুগল ড্রাইভ ও স্প্রেডশীট ওপেন",
    description: `আপনার স্প্রেডশীট লিংক খুলুন: ${TARGET_SPREADSHEET_URL}`
  },
  {
    step: "২",
    title: "অ্যাপস স্ক্রিপ্ট এডিটর খুলুন",
    description: "স্প্রেডশীটের উপরের মেনু থেকে 'Extensions' > 'Apps Script' এ ক্লিক করুন।"
  },
  {
    step: "৩",
    title: "কোড পেস্ট ও ইনিশিয়ালাইজ করুন",
    description: "এডিটরে থাকা পূর্বের কোড মুছে ওপরের ফিক্সড কোডটি পেস্ট করুন। তারপর 'setupInitialSheets' সিলেক্ট করে 'Run' চাপুন ও এক্সেস পারমিশন দিন। এতে সকল শিট ও কলাম নিখুঁতভাবে তৈরি হবে।"
  },
  {
    step: "৪",
    title: "ওয়েব অ্যাপ হিসেবে ডিপ্লয় বা রি-ডিপ্লয় করুন",
    description: "ডানপাশের উপরে 'Deploy' > 'New deployment' (বা 'Manage deployments' > Edit > New version) ক্লিক করুন। Select type: 'Web app', Execute as: 'Me', Who has access: 'Anyone' নির্বাচন করে Deploy চাপুন।"
  },
  {
    step: "৫",
    title: "URL টি ওয়েবসাইটে যুক্ত করুন",
    description: "তৈরি হওয়া Web App URL টি কপি করে এডমিন প্যানেলের 'গুগল শিট কানেকশন' বক্সে পেস্ট করে সেভ করুন। ব্যস, ওয়েবসাইট স্বয়ংক্রিয়ভাবে স্প্রেডশীটের সাথে লাইভ যুক্ত হয়ে যাবে!"
  }
];
