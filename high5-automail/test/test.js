function testSendDraft() {
    var draftId = "r-5318680169226253490";
    var draft = getDraftById(draftId).getMessage();
    var html = HtmlService.createHtmlOutput(draft.getPlainBody()).getContent();
    GmailApp.sendEmail("hhoang.nov.13@gmail.com",
        "drafts",
        "abc",
        {
            htmlBody: html
        });

    var equal = HtmlService.createHtmlOutputFromFile("reminder").getContent();
    GmailApp.sendEmail("hhoang.nov.13@gmail.com",
        "file ",
        "abc",
        {
            htmlBody: equal
        });
}

function testOpenByUrl() {
    openByUrl("https://docs.google.com/forms/d/1AfYPSl2l5QzYLe0L1wtfp9PX2tEctgiPBzw0a7_Vo98/edit");
}

function testCreateTrigger() {
    var trig =
        ScriptApp
            .newTrigger("testOpenByUrl")
            .forForm(FormApp.openByUrl("https://docs.google.com/forms/d/1AfYPSl2l5QzYLe0L1wtfp9PX2tEctgiPBzw0a7_Vo98/edit"))
            .onFormSubmit().create();
}


function testTime() {
    var date = new Date("2020-08-28T04:25");
    console.log(date.toUTCString());
    console.log(date.getTime());
}

function testGetBody() {
    //  var draft = GmailApp.getDraft("r-8361203354684717017");
    var draft = GmailApp.getDraft("r-5318680169226253490");
    console.log(isHtmlEmail("r-5318680169226253490"));
    // var body = draft.getMessage().getBody();

    // console.log(body);

    // var plainBody = draft.getMessage().getPlainBody();
    // console.log(plainBody);
}

function testQuestionName() {
    var namedValues = {
        'tên': ["Hoàng Nguyễn"],
        'email': ["Hoanghamho99@gmail.com"]
    };
    //normalize key name: FirstName to firstName
    for (const key in namedValues) {
        namedValues[normalizeHeader(key)] = namedValues[key];
        delete namedValues[key];
    }
    console.log(namedValues)
}

function testGetDataFromSheet() {
    try {
        var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rRImecrkI4DpUdnXEp4xiFJGmv2mY3E4wWxrgF7XLtU/edit#gid=785646385").getSheetByName("Form Responses 1");
        var range = sheet.getRange("A6:C6");
        range = sheet.getRange(
            range.getRowIndex(),
            range.getColumn(),
            1, //1 row
            sheet.getLastColumn());

        var objects = getRowsData(sheet, range, 1);
        console.log("rows data", objects);
        if (objects.length < 1) {
            console.log("No rows selected!");
            return;
        }

        var namedValues = objects[0];

    } catch (error) {

        console.log(error);
    }
}

function testSetAcceptingForm() {
    var params = {
        formUrl: 'https://docs.google.com/forms/d/1AfYPSl2l5QzYLe0L1wtfp9PX2tEctgiPBzw0a7_Vo98/edit',
        formName: 'tét am',
        trigger:
        {
            closingTime: '2020-08-08T21:19',
            triggerUid: '7599013154796619918',
            openingTime: ''
        },
        hasTrigger: true,
        feature: 'timer',
        fetched: true
    };
    var whichIsRunning = "closingTime";
    delete params.trigger[whichIsRunning];
    console.log(params);
    console.log(!!params.trigger.openingTime);
}

function sendMail() {
    var date = 0;
    var equipment = 1;
    var origin = 2;
    var destinations = 3;
    var emails = 4; //email column position
    var date2 = ("A3"); //i dont even know what this is...
    var equipment2 = ("B3")
    var destinations2 = ("C3")
    var origin2 = ("D3");

    //you are using all the above vars as INDEX of a row (represented as an array).
    //example, if a row has the following data:
    // ["11/11/2020", "equipment example", "origin example"];
    //then calling row[date] is equal to row[0] (date = 0)
    // so row[date] == row[0] == "11/11/2020";
    //you use date2 ("A3") as index. An array is indexed in numbers from 0, 1, 2, ... n
    //these indexes are called keys, like this:
    // row = {
    //     0: "11/11/2020",
    //     1: "equipment example",
    //     2: "origin example"
    // }
    //so row[date2] == row["A3"] WILL equal to null because there is no "A3" key

    var emailTemp = HtmlService.createTemplateFromFile("Copy of Copy of Email");
    var ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Drivers");

    //ws.getLastRow() will return the number of the last row, 
    //for example your sheet has 101 lines, then it will return 101
    //so "A2:E5" + ws.getLastRow() == "A2:E5101"
    //if you know how many rows you want to pull, drop the ws.getLastRow()
    //if not, drop the "5"
    var data = ws.getRange("A2:E5" + ws.getLastRow()).getValues();
    //now data is a 2D array, an array of array
    //each array in this "data" variable represent a row,
    //each row array has one element for each cell in that row
    //like this: data[2] (row 4) == ["cellA row4 (A4)", "cellB row 4 (B4)"];
    //if you want to get data from cell A3 in this row, 
    //use data[2][0] where 2 is the row index from starting cell, 0 is the column index from starting cell

    
    //why do you use data.fill? the guy used forEach()
    //if you use for each, this function WILL send email individually,
    //because GmailApp.send() is executed multiple times, 
    //for example, "data" has 5 rows, when you call data.forEach(exampleFunction)
    //the "exampleFunction" will run 5 times.
    //so we must create a recipients string which includes everyone in it, seperated by a comma

    //DONT USE FOR EACH

    // data.forEach(function (row) { 
    //     emailTemp.d1 = row[date]; //return row[0] == "actual data"
    //     emailTemp.d2 = row[date2]; //return row["A3"] == null because an array doesn't have "A3" key
    //     emailTemp.e1 = row[equipment]; //like d1
    //     emailTemp.o1 = row[origin]; //like d1
    //     emailTemp.dest = row[destinations]; //like d1
    //     emailTemp.e2 = row[equipment2]; //like d2, null
    //     emailTemp.o2 = row[origin2]; //null
    //     emailTemp.dest2 = row[destinations2]; //nulll
    //     var htmlMessage = emailTemp.evaluate().getContent();

    //     GmailApp.sendEmail(row[emails],
    //         "Available Equipment",
    //         "Your email doesnt support HTML",
    //         { name: "RapidRouteLogistics", htmlBody: htmlMessage, }
    //     );
    // });

    ///////////////////
    //BEGAN CRAFTING RECIPIENTS STRING
    //now we use forEach
    var recipients = "";

    var tableBody = "";
    data.forEach(function(row){
        tableBody += `
            <tr>
                <td> ${row[date]} </td>
                <td> ${row[destinations]} </td>
            </tr>
        `;
        //concatenate strings
        recipients += row[emails] + ", "; // returns row[4];
        //if your data is from A2 to E5, which has 5 columns
        //row[4] is equivalent to data from column E (0:A, 1:B, 4:E)
    })

    emailTemp.tableBody = tableBody;

    console.log("recipients", recipients);//logging for debug purposes

    //YOU REPLACE TEMPLATE VARS HERE
    //if you know where to get your data (date, date2, equipment, etc, etc), just get it by using this
    var dateValue =  ws.getRange("A2 or something").getValue();
    console.log("date value", dateValue);
    emailTemp.d1 = dateValue;
    var date2Value = ws.getRange(date2).getValue();//get value in cell date2 ("A3")
    console.log("date2 is: ", date2Value); //you need to get accustomed to using console.log my friend
    emailTemp.d2 = date2Value;
    //same for equipment2, destination2, origin2, etc

    GmailApp.sendEmail(recipients, //has everyone in it
        "Available Equipment",
        "Your email doesnt support HTML",
        { name: "RapidRouteLogistics", htmlBody: htmlMessage, }
    );

    //caution: you need to look into cc and bcc for GmailApp.sendEmail()
}

var tableBody = "";


var dataRange = sheet.getDataRange().getValues();
[
    ["Date", " Equipment type", "Destination", "Locations"],
    ["08.13.2020", "V", "Lola,PA", "Gayton, Iowa"]
]

var rowIndex = 0; //1st row
var columnIndex = 1; //second column
//index: 0, 1, 2
console.log(
    //what will i type here to print out Equiment Type?
    dataRange[0][1] //returns " Equipment Type"
);

dataRange[rowIndex][columnIndex];