//////////////////////////////////////////
/**
 * List of functions in this file:
 * setAcceptingResponses(trigger)
 */
//////////////////////////////////////////

/**
 * setup automailing for the form specified
 * in the params object.
 * 
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

function removeAutomail(params){
    if(!params.hasTrigger || !params.trigger.triggerUid){
        return;
    }
    
    deleteTriggerByUid(params.trigger.triggerUid);
}

/**
 * triggered
 * fetch a property with id and accepting
 * @param {Trigger} trigger : time-driven event object
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

/**
 * Request a form.
 * looks up if theres a trigger already set up for
 * this form
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
 * Set open or close time
 * @param {GoogleAppsScript.Forms.Form} form 
 * @param {Date} time : the specified time
 * @param {Boolean} accepting : true (open) or false (close)
 *  Timer.currentForm = {};
    Timer.currentForm.fetched = false;
    Timer.currentForm.feature = "timer";
    Timer.currentForm.formUrl = "";
    Timer.currentForm.formName = "";
    Timer.currentForm.hasTrigger = false;
    Timer.currentForm.trigger = {};
    Timer.currentForm.trigger.triggerUid = "";
    Timer.currentForm.trigger.openingTime = "";
    Timer.currentForm.trigger.closingTime = "";
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

function testSetAcceptingForm(){
    var params = { formUrl: 'https://docs.google.com/forms/d/1AfYPSl2l5QzYLe0L1wtfp9PX2tEctgiPBzw0a7_Vo98/edit',
        formName: 'tét am',
        trigger: 
        { closingTime: '2020-08-08T21:19',
            triggerUid: '7599013154796619918',
            openingTime: '' },
        hasTrigger: true,
        feature: 'timer',
        fetched: true 
    };
    var whichIsRunning = "closingTime";
    delete params.trigger[whichIsRunning];
    console.log(params);
    console.log(!!params.trigger.openingTime);
}