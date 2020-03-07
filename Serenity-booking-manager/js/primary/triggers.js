/**
 * Every day at 10pm, call createNewPrimarySheet
 */
function createTriggersForPrimarySheets(){
    var trigger = ScriptApp.newTrigger("createNewPrimarySheet")
                    .timeBased()
                    .atHour(20)
                    .nearMinute(30)
                    .everyDays(1)
                    .create();
}
/**
 * Every day at 10pm, call generateSecondarySheets
 */
function createTriggersForSecondarySheets(){
    var trigger = ScriptApp.newTrigger("generateSecondarySheets")
                    .timeBased()
                    .atHour(20)
                    .nearMinute(30)
                    .everyDays(1)
                    .create();
}