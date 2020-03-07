

function getMonthAndYearFromString(sheetName){ //02-2020
  var regex = /([0-9][0-9])[\/\-]([0-9][0-9][0-9][0-9])/
  var matches = {};
  var stringTest = "02-2020";
  var str2 = sheetName.replace(regex, function(match, month, year) {
      matches.month = month;
    if(matches.month.length == 1){matches.month="0"+matches.month}
      matches.year = year;
  });
  
  return matches;
  console.log(matches);
}