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
function doGet(e) {
    var view = "index";
    if(e.queryString){
        view = e.parameter.view;
    }
    var output;

    switch(view){
        case "timer":
            output = HtmlService.createTemplateFromFile('frontend/timer/timer')
            .evaluate()
            .setTitle("Form Timer - High5");
            break;
        case "limiter":
            output = HtmlService.createTemplateFromFile('frontend/limiter/limiter')
            .evaluate()
            .setTitle("Form Limiter - High5");
            break;
        default:
            //index
            output = HtmlService.createTemplateFromFile('frontend/automail/index')
            .evaluate()
            .setTitle("Automail - High5");
            break;
    }
    
    return output
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .addMetaTag('mobile-web-app-capable', 'yes')
    .setFaviconUrl('https://high5hanoi.edu.vn/wp-content/uploads/2020/08/Logo-High53-Custom.png');
}

function logout(){
    var triggers = ScriptApp.getProjectTriggers();
    for(const trigger of triggers){
        try {
            deleteTrigger(trigger);
        } catch (error) {
            console.error(error);
        }
    }

    ScriptApp.invalidateAuth();
    
    var url = "https://accounts.google.com/o/oauth2/revoke?token=" + ScriptApp.getOAuthToken();
    var res = UrlFetchApp.fetch(url);
    Logger.log(res.getResponseCode());
    return res.getResponseCode();
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


function deleteAllProperties(){
    var properties = PropertiesService.getUserProperties();
    getAllProperties();
    properties.deleteAllProperties();
}

function getAllProperties(){
    var properties = PropertiesService.getUserProperties();
    var all = properties.getProperties()
    console.log(all);
}