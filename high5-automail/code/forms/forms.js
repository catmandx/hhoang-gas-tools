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
    if(params.mode == "create"){
        try {
            var url = params.formUrl;
            var form = FormApp.openByUrl(url);
            var ss;

            try {
                ss = SpreadsheetApp.openById(form.getDestinationId());
            } catch (error) {
                ss = SpreadsheetApp.create(form.getTitle + " (Responses)");
                form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
            }

            params.trigger.destinationId = ss.getId();

            var trigger = ScriptApp.newTrigger("sendAutomail")
                .forSpreadsheet(ss)
                .onFormSubmit()
                .create();

            setupTriggerArguments(trigger, params, true);

            return params;
        } catch (error) {
            return error;
        }
        
    }else if(params.mode == "update"){
        //todo
    }
}

/**
 * The function sends the email everytime there is
 * a form submit.
 * 
 * Gets data from a sheet, replace the markers ({{marker}})
 * then send the email, updating the status in the sheet
 * @param {*} trigger : GSheet onFormSubmit event object
 */
function sendAutomail(trigger){
    //todo
    var params = handleTriggered(trigger.triggerUid);
    // var form = trigger.source;
    // var resp = trigger.response;
    
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