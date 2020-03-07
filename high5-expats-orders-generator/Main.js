function whenTriggered(event) { //trigger handler
  deleteTriggerByUid(event.triggerUid);
  var date = new Date();
  if(date.getMonth() === 11 && date.getFullYear() > 2019){
    changeFormDestination();
  }
  
}

function createTrigger(){ //run once, already done
  var trigger = ScriptApp.newTrigger("whenTriggered").timeBased().onMonthDay(29).create();
}

function changeFormDestination(){
  //Form đăng kí
  var formURL = "https://docs.google.com/forms/d/1SGHysRgQ0LoZzWsw1DolZfFaM851g2nooesP2KWAxqc/edit";
  var form = FormApp.openByUrl(formURL);
  
  //sheet đơn đăng kí
  var ssid = "16INHGP5OLzQkBT6vm0MV0F8m6n0-QUA4fwhuNfO3uIk";
  
  //link lại để các câu trả lời vào sheet mới 
  form.deleteAllResponses();
  form.removeDestination().setDestination(FormApp.DestinationType.SPREADSHEET, ssid);
  
  //tạo trigger vì setDestination không cập nhật luôn
  var trigger = ScriptApp.newTrigger("continuePreparing").timeBased().after(20).create();
}

function continuePreparing(event){
  //xoá trigger cho gọn 
  deleteTriggerByUid(event.triggerUid);
  
  //sheet trả lời
  var destSS = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/16INHGP5OLzQkBT6vm0MV0F8m6n0-QUA4fwhuNfO3uIk/edit?usp=sharing");
  var sheets = destSS.getSheets();
  
  //lọc ra sheet được link với form để đổi tên thành năm mới (2020, 2021, v.v)
  for(var sheet of sheets){
    Logger.log(sheet.getName()+sheet.getFormUrl())
    if(sheet.getFormUrl() === destSS.getFormUrl()){
      var sheetName = (new Date().getFullYear()+1).toString(); //nam moi
      sheet.setName(sheetName);
      console.log("changed name to: "+sheetName);
      break;
    }
  }
  
  //spreadsheet order
  var orderSS = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1-ZGqLy2Qn4jtPt8TJYaEArK4TwYyRkRYxYgDu4C_eyA/edit");
  
  //sheet order
  var orderTemplName = "Template Order";
  var orderTempl = orderSS.getSheetByName(orderTemplName); //insert new order sheet using a template
  var newOrder = orderSS.insertSheet("Expats' Orders "+sheetName, {template:orderTempl});
  
  //sheet data (sheet nhảy)
  var dataTemplName = "Template data sheet";
  var dataTempl = orderSS.getSheetByName(dataTemplName); //insert new Data sheet using a template
  var newData = orderSS.insertSheet("Data "+sheetName, {template:dataTempl});
  
  //Change formula in new Order
  replaceFormula(newOrder, dataTemplName, newData.getName(), ["B3"]); //B3 la o chua array formula
  replaceFormula(newData, (new Date().getFullYear()).toString(), sheetName, ["A1", "D1", "G1"]);
  
  //protect sheet / range
  var editors = ["high5hanoi@gmail.com", "cm.high5hanoi@gmail.com", "tmhigh5hanoi@gmail.com", "hhoang.nov.13@gmail.com"];
  protectRanges(newOrder, ["A:J", "L:L", "O:O"], editors, "Orders "+sheetName);
  
  protectSheets([newData], editors, newData.getName());
  newData.hideSheet();
  
  //di chuyển vị trí của order sheet mới
  newOrder.activate();
  orderSS.moveActiveSheet(1);
}

//HÀM NÀY THAY HẾT, KHÔNG CHỈ MATCH ĐẦU TIÊN
function replaceFormula(sheet, oldString, newString, a1Notations){ 
  //sheet: sheet chứa cái cần thay
  //oldString & new String: obvious
  //a1Notations: danh sách các ô có dữ liệu cần thay
  var ranges = sheet.getRangeList(a1Notations).getRanges();
  //regular expression, "g" flag means replace all
  var regexp = new RegExp(oldString,"g");
  
  for(var range of ranges){
    var formula = range.getFormula();
    console.log(formula+" "+newString);
    formula = formula.replace(regexp, newString.toString());
    console.log("new: "+formula);
    range.setFormula(formula);
  }
}

function protectRanges(sheet, a1Notations, editors, description){
  var ranges = sheet.getRangeList(a1Notations).getRanges();
  for(var range of ranges){
    var prot = range.protect().setDescription(description);
    var users = prot.getEditors();
    var removeList = [];
    for(var user of users){
      removeList.push(user.getEmail());
    }
    prot.removeEditors(removeList).addEditors(editors);
  }
}

function protectSheets(sheets, editors, description){
  for(var sheet of sheets){    
    var prot = sheet.protect().setDescription(description);
    var users = prot.getEditors();
    var removeList = [];
    for(var user of users){
      removeList.push(user.getEmail());
    }
    prot.removeEditors(removeList).addEditors(editors);
  }
}

function TestStuff(){
  var orderSS = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1-ZGqLy2Qn4jtPt8TJYaEArK4TwYyRkRYxYgDu4C_eyA/edit");
  var newOrder = orderSS.getSheetByName("Expats' Orders 2020");
    newOrder.activate();
  orderSS.moveActiveSheet(1);

}

