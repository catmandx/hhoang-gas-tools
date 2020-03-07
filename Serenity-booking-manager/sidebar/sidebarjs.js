window.onload = onLoad;

function onLoad(){
    $("#doneButton").click(submitInfo);
    $("#creditcard").hide();
    
    $("#trigger").change(function(){
        if($("#trigger").is(":checked")){
            $("#creditcard").slideDown('fast');
            
        }else{
            $("#creditcard").slideUp('fast');
        }
    })
}
function change(){
    google.script.run.withFailureHandler(noSheetFoundErrorHandler).scroll(document.getElementById("room").value, $("#date").val());
}

function noSheetFoundErrorHandler(error){
    swal({
        title: "Lỗi",
        text: error.message,
        icon: "error",
        button: "Chọn ngày khác!",
    });
}

function validate(selector, selector2){
    var element = $(selector);
    if(!selector2){
        if(!element.val()){
        element.addClass("error");
        }else{
            element.removeClass("error");
        }
    }else{
        var element2 = $(selector2);
        if(!element.val() && !element2.val()){
            element.addClass("error");
            element2.addClass("error");
        }else{
            element2.removeClass("error");
            element.removeClass("error");
        }
    }
}

function getBooking(){
    var error = false;
    var errorElements = [];

    $(".error-message").hide();
    $("#loading-screen").show();
    if(!$("#customerQuantity").val()){error = true;$("#customerQuantity").addClass('error');errorElements.push($("#customerQuantity"));}
    if(!$("#customerName").val() && !$("#agent").val()){
        error = true;
        errorElements.push($("#customerName"));
        $("#customerName").addClass('error');
        $("#agent").addClass('error');
    }
    var booking = {
        date: $("#date").val(), //"2020-12-31"
        room: $("#room").val(), //2-19
        customerQuantity:$("#customerQuantity").val(), //number
        customerName: $("#customerName").val(), //ten truong doan
        agent:$("#agent").val(), //String
        referrer:$("#referrer").val(), //string
        pickup:$("#pickup").val(), //String
        diet:$("#diet").val(), //String
        payment:$("#payment").val(), //payment status: notPaid, paid, congNo, datCoc
        note:$("#note").val() //multiline string
    };
    if($("#trigger").is(":checked")){
        if(!$("#ccType").val()){error = true;$("#ccType").addClass("error");errorElements.push($("#ccType"));}
        if(!$("#ccNumber").val()){error = true;$("#ccNumber").addClass("error");errorElements.push($("#ccNumber"));}
        if(!$("#ccOwner").val()){error = true;$("#ccOwner").addClass("error");errorElements.push($("#ccOwner"));}
        if(!$("#ccExpiry").val()){error = true;$("#ccExpiry").addClass("error");errorElements.push($("#ccExpiry"));}
        if(!$("#ccCVC").val()){error = true;$("#ccCVC").addClass("error");errorElements.push($("#ccCVC"));}
        var card = {
            ccType: $("#ccType").val(), //VISA || MAstercard
            ccNumber: $("#ccNumber").val(), //16 num string
            ccOwner:$("#ccOwner").val(), //string
            ccExpiry:$("#ccExpiry").val(), //"06/2020"
            ccCVC:$("#ccCVC").val() //4number string
        };
        booking.card = card;
    }
    console.log(booking);
    if(error){$("#loading-screen").hide();errorElements[0].focus();return null;};
    return booking;
}

function submitInfo(){
    var booking = getBooking();
    if(booking){
        console.log("Run script here");
        google.script.run.withSuccessHandler(bookSuccess).withFailureHandler(bookFailed).setBooking(booking);
    }
}

function bookSuccess(success){
    $("#loading-screen").hide();
    $("input").val('');
    $("textarea").val('');
}

function bookFailed(error){
    $("#loading-screen").hide();
}

function chooseCustomerToEdit(){
    $("#loading-screen").show();
    google.script.run.withSuccessHandler(chooseSuccess).withFailureHandler(chooseFailed).chooseCustomerToEdit();
}

function chooseSuccess(oldBooking){
    $("#loading-screen").hide();
    window.oldBooking = oldBooking;
    oldBooking.currentPosition = oldBooking.currentPosition;
    for(let info in oldBooking){
        if(info == "card"){
            var hasCard = false;
            let card = oldBooking[info]
            for(let cardField in card){
                if(card[cardField]){hasCard = true;}
                $("#"+cardField).val(card[cardField]);
            }
            if(hasCard){
                $('#trigger').prop('checked', true);
                $("#creditcard").show();
            }
            continue;
        }else{
            $("#"+info).val(oldBooking[info]);
        }
    }
}

function chooseFailed(e){
    $("#loading-screen").hide();
}

function updateCustomer(currentPosition){
    var booking = getBooking();
    if(booking){
        google.script.run.withSuccessHandler(updateSuccess).withFailureHandler(updateFailed).updateBooking(window.oldBooking, booking);
    }
}

function updateSuccess(e){bookSuccess(e)}

function updateFailed(e){bookFailed(e)}
