//////////////////////////////////////////
/**
 * List of functions in this file:
 * openByUrl(url, feature = "automail")
 * setFormAutomail(params)
 * removeAutomail(params)
 * setOpenAndCloseTime(params)
 * deleteTimer(params)
 * setAcceptingResponses(trigger)
 */
//////////////////////////////////////////

/**
 * Request a form and return the params for this form.
 * looks up if theres a trigger already set up for
 * this form
 * 
 * Called from the client side
 * @param {String} url : a valid gform url (with /edit)
 */
function openByUrl(url, feature = "automail"){
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

    //find triggers associated with this form and feature
    var triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        let sourceId = trigger.getTriggerSourceId();
        if(sourceId == destinationId){
            params = getArguments(trigger.getUniqueId());
            if(params.feature == feature){
                params.hasTrigger = true;
                break;
            }else{
                params = {};
            }
        }
    }

    params.formName = form.getTitle();
    return params;
}

/**
 * Setup automailing for the form specified
 * in the params object.
 * Called from the client side
 * params has the same structure as Automail.currentForm
 * @param {*} params 
 */
function setFormAutomail(params){
    try {
        var url = params.formUrl;
        var form = FormApp.openByUrl(url);
        var ss;

        try {
            ss = SpreadsheetApp.openById(form.getDestinationId());
        } catch (error) {
            ss = SpreadsheetApp.create(form.getTitle() + " (Responses)");
            form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
        }

        params.trigger.destinationId = ss.getId();
        
        if(!params.hasTrigger){
            var trigger = ScriptApp.newTrigger("sendAutomail")
            .forSpreadsheet(ss)
            .onFormSubmit()
            .create();

            params.trigger.triggerUid = trigger.getUniqueId();
            params.hasTrigger = true;
            setupTriggerArguments(trigger, params, true);
        }else{
            setupTriggerArgumentsWithUid(params.trigger.triggerUid, params, true);
        }

        return params;
    } catch (error) {
        return error.message;
    }
}

/**
 * Delete the automail trigger associated with this form
 * Called from client-side
 * @param {*} params 
 */
function removeAutomail(params){
    if(!params.hasTrigger || !params.trigger.triggerUid){
        return;
    }
    
    deleteTriggerByUid(params.trigger.triggerUid);
}

/**
 * Set up a trigger open or close time, whichever comes first
 * called from client-side or this side
 * @param {GoogleAppsScript.Forms.Form} form 
 * @param {Date} time : the specified time
 * @param {Boolean} accepting : true (open) or false (close)
 *  params = {};
    params.fetched = false;
    params.feature = "timer";
    params.formUrl = "";
    params.formName = "";
    params.hasTrigger = false;
    params.trigger = {};
    params.trigger.triggerUid = "";
    params.trigger.openingTime = "";
    params.trigger.closingTime = "";
 */
function setOpenAndCloseTime(params){
    console.log("Set open and close time", params);
    if(!params.trigger || (!params.trigger.openingTime && !params.trigger.closingTime)){
        //cant set
        return new Error("Error: no time set!");
    }

    if(params.hasTrigger){ //if already has trigger
        //check if old trigger has the same params
        var oldParams = getArguments(params.trigger.triggerUid);
        if(oldParams.trigger.openingTime == params.trigger.openingTime && 
            oldParams.trigger.closingTime == params.trigger.closingTime){
                return "Nothing changed!"; 
            }

        //if dates are different then delete the old trigger.
        var triggers = ScriptApp.getProjectTriggers();
        for (const trigger of triggers) {
            if(trigger.getUniqueId() == params.trigger.triggerUid){
                ScriptApp.deleteTrigger(trigger);
            }
        }
    }

    var date = null;
    if(params.trigger.openingTime && params.trigger.closingTime){
        //check if which comes first
        var openDate = new Date(params.trigger.openingTime);
        var closeDate = new Date(params.trigger.closingTime);
        if(openDate <= closeDate){
            date = openDate;
        }else{
            date = closeDate;
        }
    }else if(params.trigger.openingTime){
        date = new Date(params.trigger.openingTime);
    }else if(params.trigger.closingTime){
        date = new Date(params.trigger.closingTime);
    }

    if(date <= new Date()){
        return "Too soon!";
    }

    //add new trigger
    var trigger = 
        ScriptApp
        .newTrigger("setAcceptingResponses")
        .timeBased()
        .at(date)
        .create();

    params.hasTrigger = true;
    params.trigger.triggerUid = trigger.getUniqueId();
    setupTriggerArguments(trigger, params, false);
    console.log(params);
    return params;
}

/**
 * Delete the timer trigger associated with this form
 * Called from client-side

 * @param {*} params 
 */
function deleteTimer(params){
    if(!params.hasTrigger || !params.trigger.triggerUid){
        return;
    }
    
    deleteTriggerByUid(params.trigger.triggerUid);
}

/**
 * Trigger function
 * toggle AcceptingResponse status depends on the 
 * time it runs (is openingTime or closingTime).
 * 
 * If theres still openingTime or closingTime
 * -> call setOpenAndCloseTime() again
 * @param {*} trigger : time-driven event object
 */
function setAcceptingResponses(trigger){
    //delete trigger & property
    var params = handleTriggered(trigger.triggerUid);
    params.hasTrigger = false;

    console.log("Set accepting responses", params);
    var form = FormApp.openByUrl(params.formUrl);
    var whichIsRunning = ""; //openingTime or closingTime
    if(params.trigger.openingTime && params.trigger.closingTime){
        //check if which comes first
        var openDate = new Date(params.trigger.openingTime);
        var closeDate = new Date(params.trigger.closingTime);
        if(openDate <= closeDate){
            //this function runs at openingTime
            whichIsRunning = "openingTime";
        }else{
            //this function runs at closingTime
            whichIsRunning = "closingTime";
        }
    }else if(params.trigger.openingTime){
        //this function runs at openingTime
        whichIsRunning = "openingTime";
    }else if(params.trigger.closingTime){
        //this function runs at closingTime
        whichIsRunning = "closingTime";
    }

    if(whichIsRunning == "closingTime"){
        form.setAcceptingResponses(false);
        console.log("Form disabled!");
    }else if(whichIsRunning == "openingTime"){
        form.setAcceptingResponses(true);
        console.log("Form enabled!");
    }

    delete params.trigger[whichIsRunning];

    setOpenAndCloseTime(params);
}