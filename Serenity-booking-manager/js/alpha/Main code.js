/**
 * Runs when a user open the sheet associated with this script.
 * Add menu to the user interface
 * @param  {Event} e
 */
function onOpen(e){
  SpreadsheetApp.getUi().createMenu("Thông tin booking")
                              .addItem("Thêm khách", "showAddCustomerSidebar")
                              .addItem("Sửa khách", "showEditCustomerSidebar")
                              .addItem("Trợ giúp", "help").addToUi();
}

/**
 * Get the content from sidebar.html and serve it to the user as a sidebar
 */
function showAddCustomerSidebar(){
  var ui = SpreadsheetApp.getUi();
  var templ = HtmlService.createTemplateFromFile("sidebar/sidebarhtml.min")
  templ.editing = false;
  ui.showSidebar(templ.evaluate().setTitle("Thông tin khách"));
}

/**
 * Get the content from sidebar.html and serve it to the user as a sidebar
 */
function showEditCustomerSidebar(){
  var ui = SpreadsheetApp.getUi();
  var templ = HtmlService.createTemplateFromFile("sidebar/sidebarhtml.min")
  templ.editing = true;
  ui.showSidebar(templ.evaluate().setTitle("Sửa thông tin khách"));
}

/**
 * takes a param from the front-end code
 * @param {Object} booking with the structure as outlined below
 *  var booking = {
 *    date: $("#datePicker").val(), //"2020-12-31"
      room: $("#room").val(), //2-19
      customerQuantity:$("#customerQuantity").val(), //number
      customerName: $("#customerName").val(), //ten truong doan
      agent:$("#agent").val(), //String
      referrer:$("#referrer").val(), //string
      pickup:$("#pickup").val(), //String
      diet:$("#diet").val(), //String
      payment:$("#payment").val(), //payment status: notPaid, paid, congNo, datCoc
      note:$("#note").val() //multiline string
      card:{
        ccType: $("#ccType").val(), //VISA || MAstercard
        ccNumber: $("#ccNumber").val(), //16 num string
        ccOwner:$("#ccOwner").val(), //string
        ccExpiry:$("#ccExpiry").val(), //"06/2020"
        ccCVC:$("#ccCVC").val() //4number string
      }
    }
  Add this booking to the correct cell
*/
function setBooking(booking){
  booking.date = new Date(booking.date);
  var sheetName = (getMonthTwoDigits(booking.date))+"/"+booking.date.getFullYear();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var row = booking.room;
  var column = booking.date.getDate()+1;
  var cellToAdd = sheet.getRange(row, column);
  var cellContent = booking.customerQuantity + "k_" + (booking.customerName?booking.customerName:"x") + "_" + (booking.agent?booking.agent:"x");
  var cellNote = getCellNote(booking);
  
  cellToAdd.setValue(cellContent);
  cellToAdd.setNote(cellNote);
  cellToAdd.setBackground(getCellColor(booking.payment));
  cellToAdd.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.getParent().setActiveSelection(cellToAdd);

  //add to primary sheet
}
/**
 * update the existing booking, delete before write 
 * so that we can change the date & room
 * @param  {Object} oldBooking: booking with an extra property: "currentPosition"
 * @param  {Object} booking: same object as the setBooking param
 */
function updateBooking(oldBooking, booking){
  try{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if(oldBooking.currentPosition){
    var currCell = ss.getRange(oldBooking.currentPosition);
    currCell.setValue("");
    currCell.setBackground("#ffffff");
    //TODO
    //Delete oldBooking from Primary
  }}catch(e){console.log(e)}
  setBooking(booking);
}

/**
 * Get content from selected cell and return a booking Object
 * 
 */
function chooseCustomerToEdit(){
  var booking = {
    card:{}
  };
 var cell = SpreadsheetApp.getCurrentCell();
  // var cell = SpreadsheetApp.getActiveSpreadsheet().getRange("02/2020!R10");
  var sheetName = cell.getSheet().getSheetName();
  booking.currentPosition = sheetName+"!"+cell.getA1Notation();
  booking.room = cell.getRow();
  
  var monthYear = getMonthAndYearFromString(sheetName);
  booking.date = "".concat(monthYear.year,"-",monthYear.month,"-",cell.getColumn()-1);

  var cellContentExtracted = extractInfoFromCellContent(cell.getValue());
  booking.customerQuantity = cellContentExtracted.customerQuantity;
  booking.customerName = cellContentExtracted.customerName;
  booking.agent = cellContentExtracted.agent;

  booking.payment = getPaymentStatus(cell.getBackground());

  var cellNoteExtracted = extractInfoFromCellNote(cell.getNote());
  booking.referrer = cellNoteExtracted.referrer;
  booking.pickup = cellNoteExtracted.pickup;
  booking.diet = cellNoteExtracted.diet;
  booking.note = cellNoteExtracted.note;
  booking.card.ccType = cellNoteExtracted.cardccType;
  booking.card.ccNumber = cellNoteExtracted.cardccNumber;
  booking.card.ccOwner = cellNoteExtracted.cardccOwner;
  booking.card.ccExpiry = cellNoteExtracted.cardccExpiry;
  booking.card.ccCVC = cellNoteExtracted.cardccCVC;
  return booking;
}


function help(){
  //TODO
}