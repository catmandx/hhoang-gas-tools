function testSendDraft(){
    var draftId = "r-5318680169226253490";
    var draft = getDraftById(draftId).getMessage();
    var html = HtmlService.createHtmlOutput(draft.getPlainBody()).getContent();
    GmailApp.sendEmail("hhoang.nov.13@gmail.com",
        "drafts",
        "abc",
        {
            htmlBody: html
        });

    var equal = HtmlService.createHtmlOutputFromFile("reminder").getContent();
    GmailApp.sendEmail("hhoang.nov.13@gmail.com",
        "file ",
        "abc",
        {
            htmlBody: equal
        });
}

function testOpenByUrl(){
    openByUrl("https://docs.google.com/forms/d/1AfYPSl2l5QzYLe0L1wtfp9PX2tEctgiPBzw0a7_Vo98/edit");
}

function testCreateTrigger(){
    var trig = 
    ScriptApp
    .newTrigger("testOpenByUrl")
    .forForm(FormApp.openByUrl("https://docs.google.com/forms/d/1AfYPSl2l5QzYLe0L1wtfp9PX2tEctgiPBzw0a7_Vo98/edit"))
    .onFormSubmit().create();
}


function testTime(){
    var date = new Date("2020-08-28T04:25");
console.log(date.toUTCString());
console.log(date.getTime());
}

function testGetBody(){
    //  var draft = GmailApp.getDraft("r-8361203354684717017");
    var draft = GmailApp.getDraft("r-5318680169226253490");
    console.log(isHtmlEmail("r-5318680169226253490"));
    // var body = draft.getMessage().getBody();
    
    // console.log(body);
    
    // var plainBody = draft.getMessage().getPlainBody();
    // console.log(plainBody);
}

function testQuestionName(){
    var namedValues = {
        'tên': ["Hoàng Nguyễn"],
        'email': ["Hoanghamho99@gmail.com"]
    };
            //normalize key name: FirstName to firstName
    for(const key in namedValues){
        namedValues[normalizeHeader(key)] = namedValues[key];
        delete namedValues[key];
    }
    console.log(namedValues)
}

function testGetDataFromSheet(){
    try{
        var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rRImecrkI4DpUdnXEp4xiFJGmv2mY3E4wWxrgF7XLtU/edit#gid=785646385").getSheetByName("Form Responses 1");
        var range = sheet.getRange("A6:C6");
        range = sheet.getRange(
            range.getRowIndex(),
            range.getColumn(),
            1, //1 row
            sheet.getLastColumn());

        var objects = getRowsData(sheet, range, 1);
        console.log("rows data",objects);
        if(objects.length < 1){
            console.log("No rows selected!");
            return;
        }

        var namedValues = objects[0];

    } catch (error) {

        console.log(error);
    }
}