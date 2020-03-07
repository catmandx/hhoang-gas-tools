function checkBirthDay() {
  var listMail = [];
  //1. Xác định ngày hôm nay là ngày nào 
  var d = new Date();
  //2. Tìm kiếm thông tin từ các sheet
  //2.0 Lay ra spreadsheet 
  var ss= SpreadsheetApp.openById('1NbQDc53Ic6LLyMf53DMtoFFsxgMSnBUvLh7AQJ2vfIs');
  
  //2.1 Lay tat ca cac sheet
  var sheets = ss.getSheets();
  
  //2.2 chay qua tung sheet
  for (var sheet of sheets){//lệnh lặp 
    var range = sheet.getDataRange(); //lấy vùng chứa dữ liệu trong sheet
    var values = range.getValues(); //lấy dữ liệu trong vùng đó
    
    //chay qua tung hang
    for (var row of values){
      var bd = new Date(row[4]); //tao Date moi dua tren String ngay trong sheet
      if(row[2].trim() //kiểm tra xem ô chứa tên có giá trị hay không
         && row[6].trim() //kiểm tra xem ô chứa email có giá trị hay không
         && bd != null //kiểm tra xem ngày sinh có phải NULL hay không
         && bd.getDate() == d.getDate() 
         && bd.getMonth() == d.getMonth()
         && listMail.indexOf(row[6].trim()) < 0){ //kiem tra xem email có trong list đã gửi hay chưa
           
           sendMail(row); //gui mail
           listMail.push(row[6].trim());
           console.log(row); //log
      }
    }
  }
}

function sendMail(row){
  var person = {
    name: "cậu"
  };
  
  var theirName = row[2];
  try{
    var words = row[2].split(" ");
    if(words[words.length - 1] == "Anh"){
      person.name = words[words.length - 2] + " " + words[words.length - 1];
    }else{
      person.name = words[words.length - 1];
    }
    var theirEmail = row[6];
    var subject = "[HIGH5HANOI] HAPPY BIRTHDAY TO YOU!!!";
    var ourName = "High5 Hanoi";
    
    var templ = HtmlService.createTemplateFromFile("personalized");
    templ.person = person;
    var message = templ.evaluate().getContent();
    
    var cosmetics = {name: ourName, htmlBody: message};
    
    GmailApp.sendEmail(theirEmail, subject, message, cosmetics);
  }catch(ex){
    console.log(ex);
  }
}

//function test(){
//  var person = {
//    name: "cậu"
//  };
//  
//  var theirName = "Nguyuyễn Minh Hoàng";
//  try{
//    var words = theirName.trim().split(" ");
//    if(words[words.length - 1] == "Anh"){
//      person.name = words[words.length - 2] + " " + words[words.length - 1];
//    }else{
//      person.name = words[words.length - 1];
//    }
//    Logger.log(person.name);
//    var templ = HtmlService.createTemplateFromFile("personalized");
//    templ.person = person;
//    var message = templ.evaluate().getContent();
//    var cosmetics = {htmlBody: message};
//    GmailApp.sendEmail("hhoang.nov.13@gmail.com", "alo", message, cosmetics);
//  }catch(ex){
//    console.log(ex);
//    Logger.log(ex);
//  }
//}