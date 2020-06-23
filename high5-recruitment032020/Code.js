function onOpen() {
    SpreadsheetApp.getUi().
        createMenu("Tạo nhận xét").
        addItem("Tạo", "createFiles").
        addToUi();
}

function createFiles(){
    console.log("START");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Candies");
    var fileId = "1ebnu4zl_qgFukzyz3Swlt1zeP0pD4h3mcI5-qVJp8Xw";
    var folder = DriveApp.getFolderById("13D6wr95K5Cg0IjJyUc8b5z-qnNDJ3jtc");
    // var commentDoc = DocumentApp.openByUrl("https://docs.google.com/document/d/1ebnu4zl_qgFukzyz3Swlt1zeP0pD4h3mcI5-qVJp8Xw/edit");
    var commentDoc = DriveApp.getFileById(fileId);
    
    let candies = sheet.getRange("J2:J").getValues();
    var docs = sheet.getRange("S2:S").getValues();
    for (let i = 0; i < candies.length; i++) {
        const candieName = candies[i][0];
        const docName = docs[i][0];
        if(candieName && docName){
            continue;
        }else if(candieName){
            let candieDoc = commentDoc.makeCopy(candieName[0], folder)
                            .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT)
                            .getUrl();
            let columnNum = i + 2;
            sheet.getRange("S"+i).setValue(candieDoc);
            console.log(candieName,candieDoc);
        }
        
    }
}

function files2(){
  console.log("START");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // var sheets = [ss.getSheetByName("28/03/2020"), ss.getSheetByName("29/03/2020")];
    var sheets = [ss.getActiveSheet()];
    console.log(sheets[0].getName());
    if(sheets[0].getName() != "28/03/2020" && sheets[0].getName() != "29/03/2020"){return;}
    var fileId = "1ebnu4zl_qgFukzyz3Swlt1zeP0pD4h3mcI5-qVJp8Xw";
    var folder = DriveApp.getFolderById("13D6wr95K5Cg0IjJyUc8b5z-qnNDJ3jtc");
    // var commentDoc = DocumentApp.openByUrl("https://docs.google.com/document/d/1ebnu4zl_qgFukzyz3Swlt1zeP0pD4h3mcI5-qVJp8Xw/edit");
    var commentDoc = DriveApp.getFileById(fileId);
    for (const sheet of sheets) {
        let candies = sheet.getRange("M2:M").getValues();
        let linkColumnData = [];
        linkColumnData = candies.map(candieName => {
            if(candieName[0]){
                var candieDoc = commentDoc.makeCopy(candieName[0], folder)
                .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT)
                .getUrl();
                return [candieDoc];
            }
            return [""];
        })
        var docColumn = sheet.getRange("R2:R").setValues(linkColumnData);
    }
    
}