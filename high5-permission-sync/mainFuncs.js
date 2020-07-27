function onOpen(e){
  SpreadsheetApp.getUi().createMenu("Sync Permission")
  .addItem("Manual sync", "checkActiveMembers").addToUi();
}

function checkActiveMembers(e){
  if(e && SpreadsheetApp.getActiveSheet().getName() != "Active Members"){ 
    //if running from onEdit trigger, check if editing Active Member list
    return;
  }

  var allowedChangeType = ["EDIT", "INSERT_ROW", "INSERT_COLUMN", "REMOVE_ROW", "REMOVE_COLUMN", "INSERT_GRID", "REMOVE_GRID"];
  if(e && allowedChangeType.includes(e.changeType)){
    console.log(e.changeType);
  }else if(e && !allowedChangeType.includes(e.changeType)){
    console.log(e.changeType);
    return;
  }

  //get active members spreadsheet and sheet
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA/edit");
  var sheet = ss.getSheetByName("Active Members");
  var activeMembersList = sheet.getRange("activeMembersList").getValues().map(row => {
    let email = row[0].toLowerCase().trim();
    if(checkEmail(email)){
      return email;
    }
  }).filter(email => email != undefined);

  //array of sync items
  var syncItems = getSyncItems();
  console.log("Items to sync:",syncItems);

  for (const itemObject of syncItems) {
    let itemType = itemObject.type;
    let itemDescription = itemObject.description;
    let itemLink = itemObject.link;
    let itemId = itemObject.id;
    let itemPermission = itemObject.permission;
    let itemNewViewList = itemObject.defaultViewList;
    let itemNewEditList = itemObject.defaultEditList;

    let item; //file from DriveApp
    
    if(itemType === "file"){
      item = DriveApp.getFileById(itemId);
    }else if(itemType === "folder"){
      item = DriveApp.getFolderById(itemId);
    }

    let itemOwner = item.getOwner().getEmail().toLowerCase();
    itemNewEditList = itemNewEditList.filter(email => email.toLowerCase() != itemOwner);
    if(itemPermission == "edit") {
      itemNewEditList = itemNewEditList.concat(...activeMembersList);
    }else if(itemPermission == "view") {
      itemNewViewList = itemNewViewList.concat(...activeMembersList);
    }

    let itemCurrentEditList = item.getEditors().map(user => user.getEmail().toLowerCase());
    let itemCurrentViewList = item.getViewers().map(user => user.getEmail().toLowerCase());


    let editorsToAdd = itemNewEditList.filter(email => itemCurrentEditList.indexOf(email) < 0);
    let editorsToRemove = itemCurrentEditList.filter(email => itemNewEditList.indexOf(email) < 0);

    let viewersToAdd = itemNewViewList.filter(email => 
                          (itemCurrentViewList.indexOf(email) < 0 && 
                          itemNewEditList.indexOf(email) < 0));
    let viewersToRemove = itemCurrentViewList.filter(email => 
                          (itemNewViewList.indexOf(email) < 0 &&
                          itemNewEditList.indexOf(email) < 0));
    
    console.log("\nFor item", itemDescription, ": Start adding EDITORS", editorsToAdd);
    try {
      if(editorsToAdd.length && editorsToAdd.length != 0){
        item.addEditors(editorsToAdd);
      }
    } catch (error) {
      console.error(error)
    }

    console.log("Start removing EDITORS", editorsToRemove);
    editorsToRemove.forEach(editorEmail => {
      try {
        item.removeEditor(editorEmail);
      } catch (error) {
        console.error(error);
      }
    })
    
    console.log("Start adding VIEWERS", viewersToAdd);
    try {
      if(viewersToAdd.length && viewersToAdd.length != 0){
        item.addViewers(viewersToAdd);
      }
    } catch (error) {
      console.error(error);
    }

    console.log("Start removing VIEWERS", viewersToRemove);
    viewersToRemove.forEach(viewerEmail => {
      try {
        item.removeViewer(viewerEmail);
      } catch (error) {
        console.error(error);
      }
    })
  }
}

function getSyncItems(){
  var url = "https://docs.google.com/spreadsheets/d/1s9It5niqMwmDag-meTrG1Hex4eYR_Gle-jB6avAX1Rw/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(url);
  var sheet = ss.getSheetByName("Items");
  var header = sheet.getRange("B1:H1").getValues()[0];
  var itemList = sheet.getRange(2, 2, sheet.getLastRow() - 1, 7).getValues();
  var syncItems = [];
  for (let i = 0; i < itemList.length; i++) {
    const row = itemList[i];
    if(row[0].trim().length == 0){continue;}
    var item = {};
    for (let j = 0; j < row.length; j++) {
      const key = header[j].trim();
      const value = row[j].trim();
      item[key] = value;
    }
    item.defaultViewList = item.defaultViewList.split("\n");
    if(item.defaultViewList.join().length == 0){
      item.defaultViewList = [];
    }
    item.defaultEditList = item.defaultEditList.split("\n");
    if(item.defaultEditList.join().length == 0){
      item.defaultEditList = [];
    }

    syncItems.push(item);
  }
  return syncItems;
}

function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }

function checkEmail(email) {
  try{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.trim());
  }catch(ex){
    return false;
  }
}

function GETFACEBOOKID(url){
  url = url.replace("facebook","m.facebook");
  url = url.replace("m.m.", "m.");
  url = url.replace("www.","");
  console.log(url);

  var fromText = 'rid=';
  var toText = '&';

  var content = UrlFetchApp.fetch(url).getContentText();
  var scraped = data(content)
                  .from(fromText)
                  .to(toText)
                  .build();
  Logger.log(scraped);
  return scraped;
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