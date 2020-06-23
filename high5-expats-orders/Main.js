function onOrderEdit(e){
  var sheet = e.range.getSheet()
  const sheetName = sheet.getName().trim();
//  SpreadsheetApp.getActiveSpreadsheet().toast("Running script!", "Alert!", 5)
  if(sheetName.indexOf("Expats' Orders") > -1 && 
     sheetName.substr(sheetName.length - 4) > 2018){
    checkStatusAndLog(e);
    checkTeacherColumn(e);
  }
}

//  _____   _   _   _   _    ____   _____   ___    ___    _   _ 
// |  ___| | | | | | \ | |  / ___| |_   _| |_ _|  / _ \  | \ | |
// | |_    | | | | |  \| | | |       | |    | |  | | | | |  \| |
// |  _|   | |_| | | |\  | | |___    | |    | |  | |_| | | |\  |
// |_|      \___/  |_| \_|  \____|   |_|   |___|  \___/  |_| \_|
function checkTeacherColumn(e){
  var er = e.range; //range edited
  var sheet = er.getSheet();
  const teacherRange = sheet.getRange('teacherRange');
  const emailTeacherRange = sheet.getRange('emailTeacherRange');
  const logRange = sheet.getRange('logRange');
  
  if(er.getA1Notation().indexOf(":") < 0 && er.getColumn() == teacherRange.getColumn() && er.getRow() > 2){
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var col = er.getColumn();
    var row = er.getRow();

    var logCell = sheet.getRange(row, logRange.getColumn());
    
//    var status = ss.getRange(row, statusRange.getColumn()).getValue();
    var time = new Date();
    var timeString = Utilities.formatDate(time, "GMT+07:00", "dd/MM/yy, HH:mm");
    
    var expatName = sheet.getRange(row, 2).getValue();
    
    var oldTeacher = e.oldValue;
    var oldTeacherEmail = vlookup(ss.getSheetByName("teachers"), 3, 2, oldTeacher);
    
    var newTeacher = sheet.getRange(row, teacherRange.getColumn()).getValue(); //new teacher name
    var newTeacherEmail = sheet.getRange(row, emailTeacherRange.getColumn()).getValue();
    
    if(e.oldValue == undefined){ //moi nhan
      oldTeacher = 'none';
      oldTeacherEmail = 'none';
      logCell.setValue(timeString+": "+newTeacher+" - "+newTeacherEmail+": nhận expat "+expatName+"\n"+logCell.getValue());
    }else{ //đã có ng 
      if(er.isBlank()){
        newTeacher = "none";
        newTeacherEmail = 'none';
      }
      var logString = timeString+": Đổi GV: "+e.oldValue+" -> " + newTeacher;
      if(logCell.getValue().trim().length != 0){logString+="\n"+logCell.getValue();}
      logCell.setValue(logString);

    }
    
    var link = ss.getUrl();
    link += '#gid=';
    link += ss.getSheetId();
    link += '&range='+row+':'+row;
    
    console.log(expatName+" "+link);
    
    sendTeacherChangedEmail(expatName, oldTeacher, oldTeacherEmail, newTeacher, newTeacherEmail, timeString, link, logCell.getValue());
    SpreadsheetApp.getActiveSpreadsheet().toast("Mail sent to "+oldTeacherEmail+" and "+newTeacherEmail, 'Alert', 30);
    
    //HANDLE MONEY ON TEACHER CHANGED
    var info = {
      expatName: expatName,
      oldTeacher: oldTeacher,
      oldTeacherEmail: oldTeacherEmail,
      teacherName: newTeacher,
      newTeacherEmail: newTeacherEmail,
      timeString: timeString,
      link: link,
      log: logCell.getValue()
    };
    console.log("Complete log:\n",info);
      console.log("Change teacher in money sheet");
      handleFeeOnTeacherChanged(info);
  }
}

//  _____   _   _   _   _    ____   _____   ___    ___    _   _ 
// |  ___| | | | | | \ | |  / ___| |_   _| |_ _|  / _ \  | \ | |
// | |_    | | | | |  \| | | |       | |    | |  | | | | |  \| |
// |  _|   | |_| | | |\  | | |___    | |    | |  | |_| | | |\  |
// |_|      \___/  |_| \_|  \____|   |_|   |___|  \___/  |_| \_|
function checkStatusAndLog(e){
  var er = e.range; //range edited
  var statusRange = SpreadsheetApp.getActiveSheet().getRange('statusRange'); //range need to watch for (Status column)
  if(er.getA1Notation().indexOf(":") < 0 && er.getColumn() == statusRange.getColumn()){
    const teacherRange = SpreadsheetApp.getActiveSheet().getRange('teacherRange');
    const emailTeacherRange = SpreadsheetApp.getActiveSheet().getRange('emailTeacherRange');
    const logRange = SpreadsheetApp.getActiveSheet().getRange('logRange');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = SpreadsheetApp.getActiveSheet();
    
    var col = er.getColumn();
    var row = er.getRow();
    
    var teacherCell = sheet.getRange(row, teacherRange.getColumn());
    var logCell = sheet.getRange(row, logRange.getColumn());
    var status = sheet.getRange(row, statusRange.getColumn()).getValue();
    var expatName = sheet.getRange(row, 2).getValue();
    
      var time = new Date();
    var timeString = Utilities.formatDate(time, "GMT+07:00", "dd/MM/yy, HH:mm");
    
    if(teacherCell.isBlank() && e.oldValue == "Chưa được phân công"){
      var statusCell = sheet.getRange(row, statusRange.getColumn());
      statusCell.setValue("Chưa được phân công");
      SpreadsheetApp.getActiveSpreadsheet().toast("You must specify the name of the teacher!", 'Warning', 30);
//      logCell.setValue(timeString+": status changed to: "+status+"\n"+logCell.getValue());

    }else if(!teacherCell.isBlank()){ //has teacher
      
      var email = sheet.getRange(row, emailTeacherRange.getColumn()).getValue();
      var teacherName = sheet.getRange(row, teacherRange.getColumn()).getValue();
      
      
      var link = ss.getUrl();
      link += '#gid=';
      link += ss.getSheetId();
      link += '&range='+row+':'+row;
      
      console.log(expatName+" "+teacherName);
      var logString = timeString+": "+teacherName+": "+status;
      if(logCell.getValue().trim().length != 0){logString+="\n"+logCell.getValue();}
      logCell.setValue(logString);
      //send email to teacher of the change
      sendEmail(teacherName, expatName, status, e.oldValue, timeString, email, link, logCell.getValue());
      ss.toast("Mail sent to "+email, 'Alert', 30);
      
      var payload = {
        "ssid":ss.getId(),
        "sheetName":sheet.getName(),
        "teacherName":teacherName,
        "expatName":expatName,
        "statusCellPosition":sheet.getRange(row, statusRange.getColumn()).getA1Notation(),
        "status":status,
        "oldStatus":e.oldValue,
        "email": email,
        "link":link,
        "timeString":timeString
      }
      console.log("Complete log:\n"+payload);
      if(status === "Đang set lịch học"){
        console.log("Dang set lich hoc, trigger 15 days with data: "+JSON.stringify(payload, null, "\n"));
        
        var date = new Date();
        var date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 14, 17, 30);
        var trigger = ScriptApp.newTrigger("recheckAndSendMailToCM").timeBased()
        .at(date)
        .create();
        
        setupTriggerArguments(trigger, payload, false);
      }
      
      //HANDLE MONEY (ADD TO LIST)
      if(status == "Đang được dạy" && e.oldValue != "Delay/nghỉ"){
        console.log("add to money tracking list");
        addToFeeTracker(payload);
      }
    }
  }
}

//  _____   _   _   _   _    ____   _____   ___    ___    _   _ 
// |  ___| | | | | | \ | |  / ___| |_   _| |_ _|  / _ \  | \ | |
// | |_    | | | | |  \| | | |       | |    | |  | | | | |  \| |
// |  _|   | |_| | | |\  | | |___    | |    | |  | |_| | | |\  |
// |_|      \___/  |_| \_|  \____|   |_|   |___|  \___/  |_| \_|
function recheckAndSendMailToCM(event){
  //GET DATA FROM TRIGGER ID
  var data = handleTriggered(event.triggerUid);
  
  var ss = SpreadsheetApp.openById(data['ssid']);
  var sheet = ss.getSheetByName(data['sheetName']);
  
  // const teacherRange = sheet.getRange('teacherRange');
  // const emailTeacherRange = sheet.getRange('emailTeacherRange');
  // const logRange = sheet.getRange('logRange');
  const statusCell = sheet.getRange(data['statusCellPosition']);
  
  //LOGGING
  console.log(JSON.stringify(data, null, "\n") + "\nStatus at runtime: "+statusCell.getValue());
  
  if(statusCell.getValue() == "Đang set lịch học"){
    sendReminder(data);
    var date = new Date();
    //CREATE NEW TRIGGER BECAUSE AFTER 2 WEEKS THE STATUS IS STILL "Set"
    var date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 14, 17, 30);
    var trigger = ScriptApp.newTrigger("recheckAndSendMailToCM").timeBased()
    .at(date)
    .create();
    
    setupTriggerArguments(trigger, data, false);
  }
}









