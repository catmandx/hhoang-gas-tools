//////////////////////////////////////////
/**
 * List of functions in this file:
 * getRowsData(sheet, range, columnHeadersRowIndex)
 * getObjects(data, keys)
 * normalizeHeaders(headers)
 * normalizeHeader(header)
 * isCellEmpty(cellData)
 * isAlnum(char)
 * isDigit(char)
 * sendEmails() //default function, not used
 * fillInTemplateFromObject(template, data) //modified
 * sendAutomail(trigger) //my custom function
 */
//////////////////////////////////////////

/**
 * Iterates row by row in the input range and returns an array of objects.
 * Each object contains all the data for a given row, indexed by its normalized column name.
 * @param {Sheet} sheet The sheet object that contains the data to be processed
 * @param {Range} range The exact range of cells where the data is stored
 * @param {number} columnHeadersRowIndex Specifies the row number where the column names are stored.
 *   This argument is optional and it defaults to the row immediately above range;
 * @return {object[]} An array of objects.
 */
function getRowsData(sheet, range, columnHeadersRowIndex) {
    columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
    var numColumns = range.getEndColumn() - range.getColumn() + 1;
    var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
    var headers = headersRange.getValues()[0];
    return getObjects(range.getValues(), normalizeHeaders(headers));
}

/**
 * For every row of data in data, generates an object that contains the data. Names of
 * object fields are defined in keys.
 * @param {object} data JavaScript 2d array
 * @param {object} keys Array of Strings that define the property names for the objects to create
 * @return {object[]} A list of objects.
 */
function getObjects(data, keys) {
    var objects = [];
    for (var i = 0; i < data.length; ++i) {
        var object = {};
        var hasData = false;
        for (var j = 0; j < data[i].length; ++j) {
            var cellData = data[i][j];
            if (isCellEmpty(cellData)) {
                continue;
            }
            if(isCellEmpty(keys[j])){
                continue;
            }
            object[keys[j]] = cellData;
            hasData = true;
        }
        if (hasData) {
            objects.push(object);
        }
    }
    return objects;
}

/**
 * Returns an array of normalized Strings.
 * @param {string[]} headers Array of strings to normalize
 * @return {string[]} An array of normalized strings.
 */
function normalizeHeaders(headers) {
    var keys = [];
    for (var i = 0; i < headers.length; ++i) {
        var key = normalizeHeader(headers[i]);
        if (key.length > 0) {
            keys.push(key);
        }
    }
    return keys;
}

/**
 * Normalizes a string, by removing all alphanumeric characters and using mixed case
 * to separate words. The output will always start with a lower case letter.
 * This function is designed to produce JavaScript object property names.
 * @param {string} header The header to normalize.
 * @return {string} The normalized header.
 * @example "First Name" -> "firstName"
 * @example "Market Cap (millions) -> "marketCapMillions
 * @example "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
 */
function normalizeHeader(header) {
    var key = '';
    var upperCase = false;
    for (var i = 0; i < header.length; ++i) {
        var letter = header[i];
        if (letter == ' ' && key.length > 0) {
            upperCase = true;
            continue;
        }
        if (!isAlnum(letter)) {
            continue;
        }
        if (key.length == 0 && isDigit(letter)) {
            continue; // first character must be a letter
        }
        if (upperCase) {
            upperCase = false;
            key += letter.toUpperCase();
        } else {
            key += letter.toLowerCase();
        }
    }
    return key;
}

/**
 * Returns true if the cell where cellData was read from is empty.
 * @param {string} cellData Cell data
 * @return {boolean} True if the cell is empty.
 */
function isCellEmpty(cellData) {
    return typeof (cellData) == 'string' && cellData == '';
}

/**
 * Returns true if the character char is alphabetical, false otherwise.
 * @param {string} char The character.
 * @return {boolean} True if the char is a number.
 */
function isAlnum(char) {
    return char >= 'A' && char <= 'Z' ||
        char >= 'a' && char <= 'z' ||
        isDigit(char);
}

/**
 * Returns true if the character char is a digit, false otherwise.
 * @param {string} char The character.
 * @return {boolean} True if the char is a digit.
 */
function isDigit(char) {
    return char >= '0' && char <= '9';
}

/**
 * Sends emails from spreadsheet rows.
 */
function sendEmails() {
    //tochange
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheets()[0];
    var dataRange = dataSheet.getRange(2, 1, dataSheet.getMaxRows() - 1, 4);

    var templateSheet = ss.getSheets()[1];
    var emailTemplate = templateSheet.getRange('A1').getValue();

    // Create one JavaScript object per row of data.
    var objects = getRowsData(dataSheet, dataRange, 1);

    // For every row object, create a personalized email from a template and send
    // it to the appropriate person.
    for (var i = 0; i < objects.length; ++i) {
        // Get a row object
        var rowData = objects[i];

        // Generate a personalized email.
        // Given a template string, replace markers (for instance ${"First Name"}) with
        // the corresponding value in a row object (for instance rowData.firstName).
        var emailText = fillInTemplateFromObject(emailTemplate, rowData);
        var emailSubject = 'Tutorial: Simple Mail Merge';

        MailApp.sendEmail(rowData.emailAddress, emailSubject, emailText);
    }
}

/**
 * Replaces markers in a template string with values define in a JavaScript data object.
 * @param {string} template Contains markers, for instance ${"Column name"}
 * @param {object} data values to that will replace markers.
 *   For instance data.columnName will replace marker ${"Column name"}
 * @return {string} A string without markers. If no data is found to replace a marker,
 *   it is simply removed.
 */
function fillInTemplateFromObject(template, data) {
    var email = template;
    // Search for all the variables to be replaced, for instance ${"Column name"}
    // var templateVars = template.match(/\$\{\"[^\"]+\"\}/g);
    var templateVars = template.match(/\{\{[^\"\{\}]+\}\}/g);

    // Replace variables from the template with the actual values from the data object.
    // If no value is available, replace with the empty string.
    for (var i = 0; templateVars && i < templateVars.length; ++i) {
        // normalizeHeader ignores ${"} so we can call it directly here.
        var variableData = data[normalizeHeader(templateVars[i])];
        email = email.replace(templateVars[i], variableData || '');
    }

    return email;
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
    try {
        //get params stored in UserProperties
        var params = handleTriggered(trigger.triggerUid);
        console.log(params);
        //get an object with answers
        // var namedValues = trigger.namedValues;
        let range = trigger.range; //class Range
        let sheet = range.getSheet();
        range = sheet.getRange(
            range.getRowIndex(),
            range.getColumn(),
            1, //1 row
            sheet.getLastColumn());

        var objects = getRowsData(sheet, range, 1);
        console.log("rows data",objects);

        if(objects.length < 1){
            console.log("No rows selected!");
            return;
        }

        var namedValues = objects[0];

        //normalize key name: FirstName to firstName
        // for(const key in namedValues){
        //     var newKey = normalizeHeader(key);
        //     if(newKey != key){
        //         namedValues[newKey] = namedValues[key];
        //         delete namedValues[key];
        //     }
        // }

        var template = getDraftBodyById(params.trigger.draftId);
        var templatePlain = getDraftPlainBodyById(params.trigger.draftId);
        var isTemplateHtml = isHtmlEmail(params.trigger.draftId, template, templatePlain);

        var emailContent;
        var htmlBody;

        if(isTemplateHtml){
            emailContent = fillInTemplateFromObject(templatePlain, namedValues);
            htmlBody = fillInTemplateFromObject(template, namedValues)
        }else{
            emailContent = fillInTemplateFromObject(templatePlain, namedValues);
        }

        var recipient = fillInTemplateFromObject(params.trigger.recipients, namedValues);

        var subject = fillInTemplateFromObject(
            GmailApp.getDraft(params.trigger.draftId).getMessage().getSubject(), 
            namedValues
        );
        var body = emailContent;

        var options = {};

        if(params.trigger.bccRecipients){
            options.bcc = fillInTemplateFromObject(params.trigger.bccRecipients, namedValues);
        }

        if(params.trigger.ccRecipients){
            options.cc = fillInTemplateFromObject(params.trigger.ccRecipients, namedValues);
        }

        if(params.trigger.alias){
            options.from = fillInTemplateFromObject(params.trigger.alias, namedValues);
        }

        if(isTemplateHtml){
            options.htmlBody = htmlBody;
        }

        if(params.trigger.customName){
            options.name = fillInTemplateFromObject(params.trigger.customName, namedValues);
        }

        console.log(options, recipient, subject);
        GmailApp.sendEmail(recipient, subject, body, options);

    } catch (error) {
        let sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1sIeFppDrIw5MK6fxf0Nn6MyiPJB4hTNX944W3zcdN_U/edit#gid=0")
        .getSheetByName("Sheet1");
        sheet.appendRow([error.message]);
        
        let range = trigger.range;
        sheet = range.getSheet();
        let range1 = sheet.getRange(range.getRow(), range.getNumColumns()+1);
        range1.setValue(error);
        console.log(error);
    }
    //todo logging and reporting
        let sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1sIeFppDrIw5MK6fxf0Nn6MyiPJB4hTNX944W3zcdN_U/edit#gid=0")
        .getSheetByName("Sheet1");
        sheet.appendRow(["completed"]);

        //todo find "Merge status" column and log to that column
}