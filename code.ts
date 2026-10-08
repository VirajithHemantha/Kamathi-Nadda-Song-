const SHEET_ID = '1bvUDuTuAVRJjiZ6UFUHjHI4xc5vimuW8uq7bQsrMO7Y';

function doPost(e: any) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(SHEET_ID);
    
    // Parse the JSON data sent in the request body
    const data = JSON.parse(e.postData.contents);
    const formName = data.formName; // "messages" or "oneword"
    
    // Determine sheet name and required headers based on the form type
    const sheetName = formName === "messages" ? "Wordings Section" : "One Word Wishes";
    let sheet = doc.getSheetByName(sheetName);
    
    // Define the headers based on the form type
    let headers: string[] = [];
    if (formName === "messages") {
      headers = ["Timestamp", "Name", "Message"];
    } else if (formName === "oneword") {
      headers = ["Timestamp", "Word"];
    } else {
       headers = ["Timestamp", "Data"];
    }
    
    // Auto-create the sheet and add headers if it doesn't exist yet
    if (!sheet) {
      sheet = doc.insertSheet(sheetName);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    // Prepare the row data
    const rowData: any[] = [];
    headers.forEach(header => {
      if (header === "Timestamp") {
        rowData.push(new Date()); 
      } else if (header === "Name") {
        rowData.push(data.name || "");
      } else if (header === "Message") {
        rowData.push(data.message || "");
      } else if (header === "Word") {
        rowData.push(data.word || "");
      } else {
        rowData.push(JSON.stringify(data));
      }
    });
    
    // Append the new submission to the bottom of the sheet
    sheet.appendRow(rowData);
    
    // Return success to the client with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error: any) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Allow CORS for preflight requests
function doOptions(e: any) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
