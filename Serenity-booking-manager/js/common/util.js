
/**
 * @param  {Date} date
 * @returns {String} month (01-12) 
 */
function getMonthTwoDigits(date) {
    var month = date.getMonth() + 1;
    return (date.getMonth() + 1) < 10 ? "0" + month : date.getMonth() + 1;
}

/**
 * @returns {String} color hex code (e.g. #FF00EE)
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * @param  {Date[]} dateArr
 */
function sortDate(dateArr) {
    var algo = (dt1, dt2) => {
        try {
            var date1 = dt1.split("/");
            date1 = new Date(parseInt(date1[2], 10),
                parseInt(date1[1], 10) - 1,
                parseInt(date1[0], 10));

            var date2 = dt2.split("/");
            date2 = new Date(parseInt(date2[2], 10),
                parseInt(date2[1], 10) - 1,
                parseInt(date2[0], 10));

        } catch (e) { return -1; }
        return date1 - date2;
    };
    return dateArr.sort(algo)
}

/**
 * @param  {Spreadsheet} ss
 */
function sortSheetsByDate(ss) {
    //test
    //  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1LqBW-2eTdX3KaYZAuKfvpez24BWEe1MrxoKwuaaNxnE/edit#gid=1984016298");
    var sheets = ss.getSheets();
    var sheetNames = sheets.map(sheet => sheet.getName()).filter(name => name.indexOf("/") >= 0);
    var sortedSheetNames = sortDate(sheetNames);

    for (var j = 0; j < sortedSheetNames.length; j++) {
        ss.setActiveSheet(ss.getSheetByName(sortedSheetNames[j]))
        ss.moveActiveSheet(j + 1);
    }
}