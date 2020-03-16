var trackingSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/18pPMFgVlKmPfhP57IXKsA9AssgfOBhRygNVHzYHg8E8/edit#gid=0";
var fromMail = "noreply@high5hanoi.edu.vn";

function addToFeeTracker(info) {
  //Payload structure
//var payload = {
//        "ssid":ss.getId(),
//        "sheetName":sheet.getName(),
//        "teacherName":teacherName,
//        "expatName":expatName,
//        "statusCellPosition":sheet.getRange(row, statusRange.getColumn()).getA1Notation(),
//        "status":status,
//        "oldStatus":e.oldValue,
//        "email": email,
//        "link":link
//        "timeString":timeString
//      }
  var ss = SpreadsheetApp.openByUrl(trackingSpreadsheetUrl);
  var sheet = ss.getSheetByName("Tracking");
  
  var exists = findEntryPosition(sheet, info.teacherName, info.expatName);
  if(exists){return;}
  
  var rowPos = sheet.getLastRow()+1;
  var row = sheet.getRange("A"+rowPos+":F"+rowPos);
  var linkToRow = ss.getUrl();
    linkToRow += '#gid=';
    linkToRow += ss.getSheetId();
    linkToRow += '&range='+rowPos+':'+rowPos;
  var rangeData = row.getValues();
  rangeData[0][0] = '=if(isblank(INDIRECT(ADDRESS(ROW(),COLUMN()+1))),,INDIRECT(ADDRESS(ROW() - 1,COLUMN()))+1)';
  rangeData[0][1] = '=HYPERLINK(VLOOKUP("'+info.teacherName+'",Teachers!A2:D,4, false),"'+info.teacherName+'")';
  rangeData[0][2] = '=HYPERLINK("mailto:"&VLOOKUP(INDIRECT("R[0]C[-1]", false),Teachers!A2:D,2, false),VLOOKUP(INDIRECT("R[0]C[-1]", false),Teachers!A2:D,2, false))';
  rangeData[0][3] = '=Hyperlink("'+info.link+'","'+info.expatName+'")';
  rangeData[0][4] = info.timeString;
  rangeData[0][5] = 100000;
  
  row.setValues(rangeData);
  
  Logger.log(rangeData);
  
  var subject = info.teacherName+" mới đi dạy "+ info.expatName +" nè!!"
  
  var message = "Bạn "+info.teacherName+" mới chuyển trạng thái của "+info.expatName+" thành 'Đang được dạy'.<br>"+
                "Link đến sheet order (xem thông tin expat):<br><a href="+info.link+">"+info.link+"</a><br>"+
                "Link đến sheet theo dõi (để update):<br><a href="+linkToRow+">"+linkToRow+"</a>."+
                "<br><br>"+"__"+"<br>"+
                "<strong>HIGH5 HANOI</strong><br>Hotline: 0793991311 (<a href='https://fb.com/whohoi'>Mr. Hoang</a>) or <a href = 'mailto: hhoang.nov.13@gmail.com'>hhoang.nov.13@gmail.com</a>";
  var cosmetics = {htmlBody: message, fromMail: fromMail};
  GmailApp.sendEmail("hrhigh5hanoi@gmail.com", subject, message, cosmetics);
}

function handleFeeOnTeacherChanged(info){
  //INFO STRUCTURE
//  var info = {
//      expatName: expatName,
//      oldTeacher: oldTeacher,
//      oldTeacherEmail: oldTeacherEmail,
//      teacherName: newTeacher,
//      newTeacherEmail: newTeacherEmail,
//      timeString: timeString,
//      link: link,
//      log: logCell.getValue()
//    };
  var ss = SpreadsheetApp.openByUrl(trackingSpreadsheetUrl);
  var sheet = ss.getSheetByName("Tracking");
  var rowPos = findEntryPosition(sheet, info.oldTeacher, info.expatName); //exists
  if(!rowPos){return;}
  
  var linkToRow = ss.getUrl();
  linkToRow += '#gid=';
  linkToRow += ss.getSheetId();
  linkToRow += '&range='+rowPos+':'+rowPos;
  
  var teacherCell = sheet.getRange(rowPos, 2);
  teacherCell.setValue(info.teacherName);
  var subject = info.oldTeacher+" chuyển thành "+ info.teacherName +" với bạn "+info.expatName+" nè!!"
  
  var message = "Bạn "+info.oldTeacher+" bán expat "+info.expatName+" cho bạn "+info.teacherName+ "<br>"+
                "Link đến sheet order (xem thông tin expat):<br><a href="+info.link+">"+info.link+"</a><br>"+
                "Link đến sheet theo dõi (để update):<br><a href="+linkToRow+">"+linkToRow+"</a>."+
                "<br><br>"+"__"+"<br>"+
                "<strong>HIGH5 HANOI</strong><br>Hotline: 0793991311 (<a href='https://fb.com/whohoi'>Mr. Hoang</a>) or <a href = 'mailto: hhoang.nov.13@gmail.com'>hhoang.nov.13@gmail.com</a>";
  var cosmetics = {htmlBody: message, fromMail: fromMail};
  GmailApp.sendEmail("hrhigh5hanoi@gmail.com", subject, message, cosmetics);
}

function findEntryPosition(sheet, oldTeacher, expatName){
  var lastRow=sheet.getLastRow();
  var data=sheet.getRange(1,1,lastRow,4).getValues();
  for(var i = 0; i < data.length; i++){
    if(data[i][1] == oldTeacher && data[i][3] == expatName){
      return i+1;
    }
  }
  return false;
}













