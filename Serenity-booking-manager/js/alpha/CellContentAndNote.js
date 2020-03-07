/**
 * @param  {String} cellContent: formatted as "2K_Lio Guo_41 Hang Be"
 * @returns {Object} matches = 
 * {
 *  customerQuantity:{Number},
 *  customerName:{String},
 *  agent:{String}
 * }
 */
function extractInfoFromCellContent(cellContent) {
  var regex = /([0-9]+)k_(.*)_(.*)/
  var matches = {};
  cellContent.replace(regex, function(match, sk, tk, dl) {
    matches.customerQuantity = sk;
    matches.customerName = tk;
    matches.agent = dl;
  });
  return matches;
}


function extractInfoFromCellNote(note){
  //-Người giới thiệu: Nguyễn Thị Phần Lan
//  -Điểm đón: 2 persons at 15 HB
//-Ghi chú khác: khách không ăn trứng vịt, 
//  ko an ca, ko an lon
//-Thanh toán: qua paypal 2000$`;
//  Loại thẻ:	MasterCard
//Số thẻ:	5273467184339976
//Tên chủ thẻ:	Piotr Bartos
//Ngày hết hạn:	03 / 2024
//Mã số CVC:	654
  
  //  var booking = {
//    date: $("#datePicker").val(), //"2020-12-31"
//    room: $("#room").val(), //2-19
//    customerQuantity:$("#customerQuantity").val(), //number
//    customerName: $("#customerName").val(), //ten truong doan
//    agent:$("#agent").val(), //String
//    referrer:$("#referrer").val(), //string
//    pickup:$("#pickup").val(), //String
//    diet:$("#diet").val(), //String
//    payment:$("#payment").val(), //payment status: notPaid, paid, congNo, datCoc
//    note:$("#note").val() //multiline string
//    card:{
//      ccType: $("#ccType").val(), //VISA || MAstercard
//      ccNumber: $("#ccNumber").val(), //16 num string
//      ccOwner:$("#ccOwner").val(), //string
//      ccExpiry:$("#ccExpiry").val(), //"06/2020"
//      ccCVC:$("#ccCVC").val() //4number string
//    }
//  }
    var regex = /^-(.*?):(.*(?:[\r\n]+[^-].*)*)/gm
    var matches = {};
  note = note.replace(regex, function(match, info, value) {
    switch(info.trim()){
      case "Người giới thiệu":
        info = "referrer";
        break;
      case "Điểm đón":
        info = "pickup";
        break;
      case "Ghi chú khác":
        info = "note";
        break;
      case "Loại thẻ":
        info = "cardccType";
        break;
      case "Số thẻ":
        info = "cardccNumber";
        break;
      case "Tên chủ thẻ":
        info = "cardccOwner";
        break;
      case "Ngày hết hạn":
        info = "cardccExpiry";
        break;
      case "Mã số CVC":
        info = "cardccCVC";
        break;
      case "Kiêng chay":
        info = "diet";
        break;
      default:
        info = info.trim();
    }

    matches[info] = value.trim();
    return "";
  });

  if(note){ //if there's any unprocessed notes, concat them to booking.note
    if(matches.note){
      matches.note += "\n"+note;
    }else{
      matches.note = note;
    }
  }
  return matches;
}

function getCellNote(booking){
  //-Người giới thiệu: Nguyễn Thị Phần Lan
//  -Điểm đón: 2 persons at 15 HB
//-Ghi chú khác: khách không ăn trứng vịt, 
//  ko an ca, ko an lon
//-Thanh toán: qua paypal 2000$`;
//  Loại thẻ:	MasterCard
//Số thẻ:	5273467184339976
//Tên chủ thẻ:	Piotr Bartos
//Ngày hết hạn:	03 / 2024
//Mã số CVC:	654
  
  var note = "";
  note += booking.referrer?"\n-Người giới thiệu: "+booking.referrer:"";
  note += booking.pickup?"\n-Điểm đón: "+booking.pickup:"";
  note += booking.diet?"\n-Kiêng chay: "+booking.diet:"";
  note += booking.card?"\n-Loại thẻ: "+booking.card.ccType
  +"\n-Số thẻ: "+booking.card.ccNumber
  +"\n-Tên chủ thẻ: "+booking.card.ccOwner
  +"\n-Ngày hết hạn: "+booking.card.ccExpiry
  +"\n-Mã số CVC: "+booking.card.ccCVC:"";
  note += booking.note?"\n-Ghi chú khác: "+booking.note:"";
  return note.trim();
}

function getCellColor(status){
//PHÒNG TRỐNG#ffffff
//ĐÃ ĐẶT CỌC, CHECK IN THU NỐT#ff9900
//ĐÃ THANH TOÁN#ffff00
//CHƯA THANH TOÁN#00ff00
//ĐỂ CÔNG NỢ CUỐI THÁNG#00ffff
  switch(status) {
    case "notPaid":
      return "#00ff00";
    case "paid":
      return "#ffff00";
    case "congNo":
      return "#00ffff";
    case "datCoc":
      return "#ff9900";
    default:
      return "#ffffff";
  }
}

function getPaymentStatus(color){
  //PHÒNG TRỐNG#ffffff
//ĐÃ ĐẶT CỌC, CHECK IN THU NỐT#ff9900
//ĐÃ THANH TOÁN#ffff00
//CHƯA THANH TOÁN#00ff00
//ĐỂ CÔNG NỢ CUỐI THÁNG#00ffff
  switch(color) {
    case "#00ff00":
      return "notPaid";
    case "#ffff00":
      return "paid";
    case "#00ffff":
      return "congNo";
    case "#ff9900":
      return "datCoc";
    default:
      return "empty";
  }
}
