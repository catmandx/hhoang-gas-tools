//////////////////////////////////////////
/**
 * List of functions in this file:
 * setAcceptingResponses(trigger)
 */
//////////////////////////////////////////


function submitAutomail(params){
    if(params.mode == "create"){
        var url = params.formUrl;
        var form = FormApp.openByUrl(url);
        var ss;
        if(form.getDestinationType != FormApp.DestinationType.SPREADSHEET){
            ss = SpreadsheetApp.create(form.getTitle + " (Responses)");
            form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
            params.trigger.destinationId = ss.getId();
        }else{
            ss = SpreadsheetApp.openById(form.getDestinationId());
        }

        var trigger = ScriptApp.newTrigger("sendAutomail")
            .forSpreadsheet(ss)
            .onFormSubmit()
            .create();

        setupTriggerArguments(trigger, params, true);
    }
}

function sendAutomail(trigger){
    //todo
    var params = handleTriggered(trigger.triggerUid);
    var form = trigger.source;
    var resp = trigger.response;
    
}





/**
 * triggered
 * fetch a property with id and accepting
 * @param {Trigger} trigger 
 */
function setAcceptingResponses(trigger){
    var option = handleTriggered(trigger.triggerUid);
    var id = option.id;
    var form = FormApp.openById(id);
    var accepting = option.accepting;
    form.setAcceptingResponses(accepting);

    deleteTrigger(trigger);
}