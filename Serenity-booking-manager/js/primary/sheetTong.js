/**
 * @param  {} booking
 *  var booking = {
 *    date: $("#datePicker").val(), //"2020-12-31"
      room: $("#room").val(), //2-19
      customerQuantity:$("#customerQuantity").val(), //number
      customerName: $("#customerName").val(), //ten truong doan
      agent:$("#agent").val(), //String
      referrer:$("#referrer").val(), //string
      pickup:$("#pickup").val(), //String
      diet:$("#diet").val(), //String
      payment:$("#payment").val(), //payment status: notPaid, paid, congNo, datCoc
      note:$("#note").val() //multiline string
      card:{
        ccType: $("#ccType").val(), //VISA || MAstercard
        ccNumber: $("#ccNumber").val(), //16 num string
        ccOwner:$("#ccOwner").val(), //string
        ccExpiry:$("#ccExpiry").val(), //"06/2020"
        ccCVC:$("#ccCVC").val() //4number string
      }
    }
 */
function addBookingToPrimary(booking){
    //check if sheet for that day exists

    //if doesnt exist, return

    //if it exists, add to it

    
}
/**
 * @param  {} oldBooking: booking with 'currentPosition' property
 * @param  {} booking
 */
function updateBookingToPrimary(oldBooking, booking){
    //check if oldBooking exists

    //delete if exists

    //call addBookingToPrimary
}

function deleteBookingFromPrimary(booking){
    
}

/**
 * @param  {Date} date
 */
function createNewPrimarySheet(e){
    //check if that sheet exists

    //create new primary sheet 1 week ahead of the current day

}

/**
 * @param  {Date} date
 */
function hideOldPrimarySheet(date){
    //hide all primary sheet that predates the date given
}