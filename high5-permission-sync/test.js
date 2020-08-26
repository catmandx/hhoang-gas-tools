function test(){
    var emailArr = ["hoanghamho99@gmail.com", "a@abv.com", "a a@.com"];
    Logger.log(emailArr.filter(function(email){
        try{
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email.trim());
        }catch(ex){
          return false;
        }
    }))
  }

function test2(){
  var str = "";
  var arr = str.split("\n");
  console.log(arr)
  console.log(arr.length);
}

  //array of sync items (DriveApp)
  // var syncItems = 
  //   [
  //     {
  //       type:"file",
  //       description:"Sheet Active members",
  //       link:"https://docs.google.com/spreadsheets/d/11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA/edit",
  //       id:"11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA",
  //       permission:"edit",
  //       defaultEditList: ["hrhigh5hanoi@gmail.com", 
  //                         "hhoang.nov.13@gmail.com",
  //                         "high5hanoi@gmail.com",
  //                         "cm.high5hanoi@gmail.com",
  //                         "mdhigh5material@gmail.com",
  //                         "edhigh5hanoi@gmail.com", 
  //                         "high5hanoi.edu.vn@gmail.com", 
  //                         "logistics.high5hanoi@gmail.com"],
  //       defaultViewList: []
  //     },
  //     {
  //       type: "file",
  //       description:"Sheet Expats' orders",
  //       link:"https://docs.google.com/spreadsheets/d/1-ZGqLy2Qn4jtPt8TJYaEArK4TwYyRkRYxYgDu4C_eyA/edit",
  //       id:"1-ZGqLy2Qn4jtPt8TJYaEArK4TwYyRkRYxYgDu4C_eyA",
  //       permission:"edit",
  //       defaultEditList: ["high5hanoi@gmail.com", 
  //                         "cm.high5hanoi@gmail.com", 
  //                         "hrhigh5hanoi@gmail.com", 
  //                         "mdhigh5material@gmail.com",
  //                         "edhigh5hanoi@gmail.com", 
  //                         "high5hanoi.edu.vn@gmail.com", 
  //                         "hhoang.nov.13@gmail.com",
  //                         "logistics.high5hanoi@gmail.com"],
  //       defaultViewList: []
  //     },
  //     {
  //       type:"folder",
  //       description:"Folder giao trinh 2018",
  //       link:"https://drive.google.com/drive/folders/1pkiRE5SlhmYLk0WxHx9l0z4C7T6rcgai?usp=sharing",
  //       id:"1pkiRE5SlhmYLk0WxHx9l0z4C7T6rcgai",
  //       permission:"view",
  //       defaultEditList: ["cm.high5hanoi@gmail.com",
  //                         "hhoang.nov.13@gmail.com",
  //                         "high5hanoi@gmail.com"],
  //       defaultViewList: ["hrhigh5hanoi@gmail.com", 
  //                         "mdhigh5material@gmail.com",
  //                         "edhigh5hanoi@gmail.com", 
  //                         "high5hanoi.edu.vn@gmail.com",
  //                         "logistics.high5hanoi@gmail.com"]
  //     }
  // ];

function testDriveApi(){
  Drive.Permissions.insert()
}

function checkActiveMembersOld(e) { //OnEdit trigger //periodic trigger
  // if(e && SpreadsheetApp.getActiveSheet().getName() != "Active Members"){ //if running from onEdit trigger, check if editing Active Member list
  //   return;
  // }
  // //get active members spreadsheet and sheet
  // var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA/edit");
  // var sheet = ss.getSheetByName("Active Members");
  // var syncSheets = ["https://docs.google.com/spreadsheets/d/11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA/edit",
  // "https://docs.google.com/spreadsheets/d/1-ZGqLy2Qn4jtPt8TJYaEArK4TwYyRkRYxYgDu4C_eyA/edit"];
  
  // for (const sheetLink of syncSheets) {
  //   var orderSheet = SpreadsheetApp.openByUrl(sheetLink);

  //   var activeMembersList = ["high5hanoi@gmail.com", "cm.high5hanoi@gmail.com", "hrhigh5hanoi@gmail.com", "mdhigh5material@gmail.com",
  //                   "edhigh5hanoi@gmail.com", "high5hanoi.edu.vn@gmail.com", "hhoang.nov.13@gmail.com"];
  //   var ordersSheetEditorsList = [];

  //   orderSheet.getEditors().forEach((user) => ordersSheetEditorsList.push(user.getEmail()));
    
  //   sheet.getRange("activeMembersList").getValues().forEach((row) => {
  //     if(checkEmail(row[0].trim())){
  //       activeMembersList.push(row[0].toLowerCase());
  //     }
  //   });
    
  //   var editorsToAdd = activeMembersList.filter(el => ordersSheetEditorsList.indexOf(el) < 0);
    
  //   var editorsToRemove = ordersSheetEditorsList.filter(email => activeMembersList.indexOf(email) < 0);
    
  //   console.log("Start adding");
  //   editorsToAdd.forEach((email) => {
  //     console.log(email)
  //     try{
  //       orderSheet.addEditor(email)
  //     }catch(ex){console.log(ex)}
  //   });
    
  //   console.log("Start removing");
  //   editorsToRemove.forEach((email) => {
  //     console.log(email)
  //     try{
  //       orderSheet.removeEditor(email)
  //     }catch(ex){console.log(ex)}
  //   });
  // }
}