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
    //todo delete rule logic
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
    var option = handleTriggered(trigger.triggerUid);
    var id = option.id;
    var form = FormApp.openById(id);
    var accepting = option.accepting;
    form.setAcceptingResponses(accepting);

    deleteTrigger(trigger);
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