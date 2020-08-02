function doGet() {
    return HtmlService.createTemplateFromFile('frontend/index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .addMetaTag('mobile-web-app-capable', 'yes')
    .setFaviconUrl('https://i0.wp.com/high5hanoi.edu.vn/wp-content/uploads/2019/09/cropped-logo-ngang-1.png')
    .setTitle("High5 Automail");
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

function getEmail() {
    return Session.getActiveUser().getEmail();
}

function openByUrl(url){
    var res = {};
    var form = FormApp.openByUrl(url);
    var id = form.getId();
    var triggers = ScriptApp.getUserTriggers(form);
    var triggerList = [];
    for (const trigger of triggers) {
        let trigObj
    }
}

function setOpenOrCloseTime(form, time, accepting){
    time = new Date();

    var trigger = ScriptApp.newTrigger("setAcceptingResponses").timeBased().at(time).create();
    setupTriggerArguments(trigger, {id:form.getId(), accepting: accepting}, false);
}

function testSendSomething(str){
    return str;
}