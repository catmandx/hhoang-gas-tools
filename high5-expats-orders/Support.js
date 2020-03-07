//GLOBAL VARIABLE
var fromMail = "noreply@high5hanoi.edu.vn";



//<-- SEND STATUS CHANGED EMAIL -->

function sendEmail(name, expatName, status, oldStatus, time, email, link, completeLog) {
  var subject = "[HIGH5HANOI] Google Sheets Activity for "+expatName;
  var ourName = "High5 Hanoi Automated Mail";
  
  // This is the body of the auto-reply message
  var message =  "This is an automated response created with love from High5."+
    "<br><br>We detected an activity with the expat you chose: <b>"+expatName+"</b>"+
      "<br><br>On "+time+", the status changed from <b>"+oldStatus+"</b> to <b>"+status+"</b> by <b>"+name+"</b>"+
        "<br><br>We are sending this message to make sure it was you, if not, please revert any changes made by "+name+
          " <a href="+link+">by clicking on this link</a> ! "+
            "Be aware that the link <b>ONLY</b> works with <b>computers browsers and the Google Sheet App on Android and IOS!</b>";
            
  var arr = completeLog.split("\n");
  if(Object.getOwnPropertyNames(arr).length === 0){
    message+= "<br><br>There's no existing log for this expat!";
  }else{
    message+= "<br><br>Below is the complete log for this expat: <br>";
    for(var string of arr){
      message+= string + "<br>";
    }
  }
  
  message+= "<br>Thank you and have a good day!"+
    "<br><br>"+"__"+"<br>"+
      "<strong>HIGH5 HANOI</strong><br>Hotline: 0793991311 (<a href='https://fb.com/whohoi'>Mr. Hoang</a>) or <a href = 'mailto: hhoang.nov.13@gmail.com'>hhoang.nov.13@gmail.com</a>";
  
  // before emailing set up one last var
  var cosmetics = {name: ourName, htmlBody: message, from: fromMail};
//  GmailApp.sendEmail(email, subject, message, cosmetics);
//  addLabel("Status changed",subject, email);
  var query = "to:"+email+" "+"subject:"+subject;
  var existingThreads = GmailApp.search(query, 0, 10);
  if(existingThreads.length > 0){
//    var messages = existingThreads[0].getMessages();
//    if(messages[messages.length-1].getReplyTo()
    existingThreads[0].createDraftReply(message, cosmetics).update(email, subject, message, cosmetics).send();
    addLabel("Status changed",subject, email);
  }else{ 
    GmailApp.sendEmail(email, subject, message, cosmetics);
    addLabel("Status changed",subject, email);
  }
}



//<-- SEND TEACHER CHANGED EMAIL -->

function sendTeacherChangedEmail(expatName, oldTeacher, oldTeacherEmail, newTeacher, newTeacherEmail, time, link, completeLog){
  var subject = "[High5 Hanoi] Teacher for " + expatName +" changed!";
  var ourName = "High5 Hanoi Automated Mail";
  
  var message =  "This is an automated response created with love from High5."+
    "<br><br>We detected an activity with the expat: <b>"+expatName+"</b>"+
      "<br><br>On "+time+", the teacher changed to <b>"+newTeacher+"</b> from <b>"+oldTeacher+"</b>"+
        "<br><br>We are sending this message to make sure it was you, if not, please revert any changes <a href="+link+">by clicking on this link</a> ! "+
            "Be aware that the link <b>ONLY</b> works with <b>computers browsers and the Google Sheet App on Android and IOS!</b>";
            
  var arr = completeLog.split("\n");
  if(Object.getOwnPropertyNames(arr).length === 0){
    message+= "<br><br>There's no existing log for this expat!";
  }else{
    message+= "<br><br>Below is the complete log for this expat: <br>";
    for(var string of arr){
      message+= string + "<br>";
    }
  }
  
  message+= "<br>Thank you and have a good day!"+
    "<br><br>"+"__"+"<br>"+
      "<strong>HIGH5 HANOI</strong><br>Hotline: 0793991311 (<a href='https://fb.com/whohoi'>Mr. Hoang</a>) or <a href = 'mailto: hhoang.nov.13@gmail.com'>hhoang.nov.13@gmail.com</a>";
  
  var cosmetics = {name: ourName, htmlBody: message, from: fromMail};
  var recipients = "cm.high5hanoi@gmail.com";
  if(oldTeacherEmail != 'none'){
    recipients+= ","+oldTeacherEmail;
//    GmailApp.sendEmail(oldTeacherEmail, subject, message, cosmetics);
//    addLabel("Teacher changed", subject, oldTeacherEmail);
  }
  if(newTeacherEmail != 'none'){
    recipients+= ","+newTeacherEmail;
//    GmailApp.sendEmail(newTeacherEmail, subject, message, cosmetics);
//    addLabel("Teacher changed", subject, newTeacherEmail);
  }
//  GmailApp.sendEmail('cmhigh5hanoi@gmail.com', subject, message, cosmetics);

  GmailApp.sendEmail(recipients, subject, message, cosmetics)
  addLabel("Teacher changed", subject, "cm.high5hanoi@gmail.com");
}



//<-- SEND EMAIL TO REMIND USER -->
function sendReminder(data){
  var subject = "[HIGH5HANOI] "+data['expatName']+" đang bơ vơ...";
  var ourName = "High5 Hanoi Automated Mail";
  var message = "Chào cậu, CM đây! 2 tuần trước bạn có nhận expat có tên: " + data['expatName'] + " phải không?"+
    "<br>Đến bây giờ là 2 tuần rồi mà bạn và expat đó vẫn chưa gặp nhau sao? Có vấn đề gì thì bạn tâm sự bằng cách reply mail này (reply vào mail CM) nhé!!"+
    "<br>Bạn bấm vào link này để cập nhật status giúp chúng tớ nha <3 :"+
    "<br>"+data['link'];
  message+= "<br>Thank you and have a good day!"+
    "<br><br>"+"__"+"<br>"+
      "<strong>HIGH5 HANOI</strong><br>Hotline: 0793991311 (<a href='https://fb.com/whohoi'>Mr. Hoang</a>) or <a href = 'mailto: hhoang.nov.13@gmail.com'>hhoang.nov.13@gmail.com</a>";
  
  
  // before emailing set up one last var
  var cosmetics = {name: ourName, htmlBody: message, from: fromMail, replyTo: "cm.high5hanoi@gmail.com", cc: 'cm.high5hanoi@gmail.com'};
  
  GmailApp.sendEmail(data['email'], subject, message, cosmetics);
  addLabel("Remind mail", subject, data['email']);
}





//<-- ADD LABEL TO MAIL JUST SENT -->
function addLabel(label, subject, recipient){
  var timeString = Utilities.formatDate(new Date(), "GMT+07:00", "MM/dd/yy");
  var query = "in:sent after:"+timeString+" to:"+recipient+" has:nouserlabels "+subject;
  console.log(query);
  var results = GmailApp.search(query);
  var label = GmailApp.getUserLabelByName(label);
  try{
    label.addToThreads(results);
    console.log("Added label "+label.getName()+"to thread: "+subject);
  }catch(ex){
    console.log(ex);
  }
}
/*
Imitates the Vlookup function. Receives:
1. sheet - A reference to the sheet you would like to run Vlookup on
2. column - The number of the column the lookup should begin from
3. index - The number of columns the lookup should cover.
4. value - The desired value to look for in the column.
Once the cell of the [value] has been found, the returned parameter would be the value of the cell which is [index] cells to the right of the found cell.
*/
function vlookup(sheet, column, index, value) {

  var lastRow=sheet.getLastRow();
  var data=sheet.getRange(1,column,lastRow,column+index).getValues();

  for(i=0;i<data.length;++i){
    if (data[i][0]==value){
      return data[i][index];
    }
  }
}

function showAlert(message) {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     message,
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    return true;
  } else {
    // User clicked "No" or X in the title bar.
    return false;
  }
}