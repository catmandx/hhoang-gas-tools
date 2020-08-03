//////////////////////////////////////////
/**
 * List of functions in this file:
 * doGet()
 * include(filename)
 * getEmail()
 * openByUrl(url)
 * setOpenOrCloseTime(form, time, accepting)
 */
//////////////////////////////////////////

/**
 * returns HTMLOutputs
 */
function doGet() {
    return HtmlService.createTemplateFromFile('frontend/index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .addMetaTag('mobile-web-app-capable', 'yes')
    .setFaviconUrl('https://high5hanoi.edu.vn/wp-content/uploads/2020/08/Logo-High53-Custom.png')
    .setTitle("High5 Automail");

    //todo routers to add more pages
}

/**
 * used to include javascript.html and css.html
 * into index.html
 * @param {String} filename 
 */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

/**
 * Get current active users email
 */
function getEmail() {
    return Session.getActiveUser().getEmail();
}

/**
 * Request a form.
 * looks up if theres a trigger already set up for
 * this form
 * @param {String} url : a valid gform url (with /edit)
 */
function openByUrl(url){
    var res = {};
    var form = FormApp.openByUrl(url);
    var formId = form.getId();
    var destinationId = "";
    try {
        destinationId = form.getDestinationId();
    } catch (error) {
        console.log(error);
    }

    var params = {}

    //find triggers associated with this form
    var triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        let sourceId = trigger.getTriggerSourceId();
        if(sourceId == destinationId){
            params = getArguments(trigger.getUniqueId());
            params.hasTrigger = true;
            break;
        }
    }

    params.formName = form.getTitle();
    return params;
}

/**
 * Set open or close time
 * @param {GoogleAppsScript.Forms.Form} form 
 * @param {Date} time : the specified time
 * @param {Boolean} accepting : true (open) or false (close)
 */
function setOpenOrCloseTime(form, time, accepting){
    time = new Date();

    var trigger = ScriptApp.newTrigger("setAcceptingResponses").timeBased().at(time).create();
    setupTriggerArguments(trigger, {id:form.getId(), accepting: accepting}, false);
}