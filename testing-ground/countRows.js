/**
 * This function will get you the number of rows in your sheet.
 * This is for just one specific sheet, you need to develop
 * custom code to count ALL sheet in your spreadsheet
 */
function countRows(){
    //Get the "Data" sheet (Tab)
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data")
    //read the getLastRow() documentation
    return sheet.getLastRow();
}