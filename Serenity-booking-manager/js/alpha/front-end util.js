/**
 * Coordination between front-end sidebar and sheet
 * Select the column with the date specified
 * @param  {Date} date
 * @deprecated
 */
function scrollToDate(date){
  date = parseInt(date);
  if(date < 1 || date > 31){return}
  var row = 1;
  var column = 1;
  var cell = SpreadsheetApp.getCurrentCell();
  if(cell != null){
    row = cell.getRow();
  }
  column = date+1;
  var newCell = SpreadsheetApp.getActiveSheet().getRange(row, column);
  SpreadsheetApp.setCurrentCell(newCell);
}

/**
 * Takes a number (same as the row number) and move the active
 * selection to that row
 * @param  {Number} room
 * @deprecated
 */
function scrollToRoom(room){
  var row = 1;
  var column = 1;
  var cell = SpreadsheetApp.getCurrentCell();
  if(cell != null){
    column = cell.getColumn();
  }
  
  if(room == "triple1"){
    row = 2;
  }else{
    row = 3;
  }
  
  
  var newCell = SpreadsheetApp.getActiveSheet().getRange(row, column);
  SpreadsheetApp.setCurrentCell(newCell);
}

/**
 * Takes in precise date and room number (on the sheet) and move 
 * to the cell representing that date. Can move to another sheet
 * 
 * @param  {Number} room
 * @param  {Date} date
 * @throws {Error} error: when there is no sheet represented by the date
 */
function scroll(room, date){
  date = new Date(date);
  var row = room;
  var column = date.getDate()+1;
  var sheetName = (getMonthTwoDigits(date))+"/"+date.getFullYear();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  if(sheet == null){throw new Error("Không có sheet nào có tên: "+sheetName)}
  
  sheet.activate();
  var newCell = SpreadsheetApp.getActiveSheet().getRange(row, column);
  SpreadsheetApp.setCurrentCell(newCell);
}

/**
 * generate HTML:  list of <option> elements to choose from
 * each <option> will have value of the row number
 * and the text will be the room on that row
 * @returns {String} optionElements
 */
function getRooms(){
  //<option value="2">Triple 1</option>
  var range = SpreadsheetApp.getActiveSheet().getRange("A2:A30").getValues();
  var optionElements = "";
  var rowNum = 2;
  for(var row of range){
    if(row[0]){
      optionElements+='<option value="'+rowNum+'">'+row[0]+'</option>';
    }
    rowNum++;
  }
  
  return optionElements;
}