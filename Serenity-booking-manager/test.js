testSort()
function testSort(){
  var arr = ['04/12/2020', "5/5/2010", "1/1/2019"];

  var sort2 = (date1, date2) => {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return date1 - date2;
  }
  arr.sort(sort2)
}

function testClass(){
  // var card = new Card()
  // card.ccType = "abc";
  // console.log(card.ccType);
  // console.log(card._ccType)
}


function testRE() {
//  Agent: 
//No. of pax: 
//P/U:
//Notes:
//Payment:
  var re = /Agent:.*\nNo. of pax:.*\nP\/U:.*\nNotes:.*\nPayment:.*/;
  var string = `Agent: 34 bà triệu
No. of pax: 2 kahsch
P/U: ở đây
Notes: khách không ăn trứng vịt, alo alo
Payment: qua paypal 2000$`;
  console.log(string.match(re))
}

function testRE2(){
  var regex = /^-(.*?):(.*(?:[\r\n]+[^-].*)*)/gm
  var matches = {};
  var str = 
`
-Điểm đón: 2 persons at 15 HB
-Ghi chú khác: khách không ăn trứng vịt, 
  ko an ca, ko an lon
-Thanh toán : qua paypal 2000$`;
  str = str.replace(regex, function(match, info, value) {
//    matches.push({
//      info: info,
//      value: value.trim()
//    });
    matches[info] = value;
    return "";
  });
//  console.log(str2)
  console.log(matches);
}

function testRE3(){
  var regex = /([0-9]+)k_(.*)_(.*)/
  var matches = [];
  var string = "2k_Lio Guo_41 Hang Be";
  var str2 = string.replace(regex, function(match, sk, tk, dl) {
    matches.push({
      sk: sk,
      tk: tk,
      dl:dl
    });
    return "";
  });
  console.log(matches);
  return matches;
}

function testDate(){
  var date = new Date();
  var sheetName = (date.getMonth()+1)+"/"+date.getFullYear();
  var month = date.getMonth()+1;
  var monthString = (date.getMonth()+1)<10?"0"+month:date.getMonth()+1;
  Logger.log(sheetName);
}

function testCellContent(){
  var booking = {
    customerQuantity:3,
    customerName:"abc"
  }
  var cellContent = booking.customerQuantity + "k_" + (booking.customerName?booking.customerName:"x") + "_" + (booking.agent?booking.agent:"x")
}

function testCellNote(){
  var booking = {
    date: "2020-02-04",
    room: null,
    customerQuantity: "2",
    customerName: "Hoang",
    agent: "Viet travel",
    pickup: "18HTM",
    diet: "Kieng do nua",
    payment: "paid",
    note: "khong co ghi chu gi a",
  }
  var note = getCellNote(booking);
  Logger.log(note);
}

function testErrorWhenGetSheet(){
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1vwcT_gbj-tQhYq5RybGpTWJLU2Sw70LiSHyrx9nCBiE/edit#gid=0");
  try{
  var sheet = ss.getSheetByName("03/2020");
    Logger.log(sheet);
  }catch(e){
    var e = e
  }
}

function testRE4(){
  var regex = /([0-9][0-9])\-([0-9][0-9][0-9][0-9])/
  var matches = [];
  var string = "02-2020";
  var str2 = string.replace(regex, function(match, month, year) {
    matches.push({
      month:month,
      year:year
    });
  });
  console.log(matches);
}

function test5(){
  var booking = {};
  if(booking.note){
    booking = "abc";
  }else{
    booking = "bcd";
  }
}