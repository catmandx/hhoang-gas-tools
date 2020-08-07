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
