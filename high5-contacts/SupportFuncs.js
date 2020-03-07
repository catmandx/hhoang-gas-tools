function locSDT(data, phoneIndex) { //index in array data
  var ss = SpreadsheetApp.openById("11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA");
  var sheet = ss.getSheetByName("Members");
  var phone = sheet.getRange("J5:J30").getValues().reduce(
    function(accumulator, currentValue) {
      return accumulator.concat(currentValue);
    },
    []
  ).filter(
    function(phone){
      if(phone.length > 0){
        return phone;
      }
    }
  );
  
  for(var i = 0; i < phone.length; i++){
    if(phone[i].indexOf("0") == 0){
      phone[i] = phone[i].slice(1, phone[i].length).replace(" ","");
    }
  }
  
  Logger.log(phone);
  
  var ppl = listConnectionNames(100);


  phone = findPhoneNotInList(ppl, phone);
  ppl.forEach(function(person) {
    if (person.names && person.names.length > 0) {
      Logger.log(person.names[0].displayName);
    } else {
      Logger.log('No display name found for connection.');
    }
    if(person.phoneNumbers && person.phoneNumbers.length > 0){
      Logger.log(person.phoneNumbers[0].value);
      Logger.log(person.phoneNumbers[0].canonicalForm);
    }
  });
//  Logger.log(ppl);
  Logger.log(phone);
}

function findIntersection(ppl, phone){
  var ppl1 = [];
  for(var i = 0; i < ppl.length; i++){
    for(var j = 0; j < phone.length; j++){
      if(ppl[i].phoneNumbers[0].canonicalForm.indexOf(phone[j]) != -1){
        phone.splice(j,1);
        ppl1.push(ppl[i]);
      }
    }
  }
  return ppl1;
}

function findPhoneNotInList(ppl, phone){ 
  
  //ppl: array of JSON object Person
  //phone: 1D array of phone (in form: 1213991311)
    var ppl1 = [];
  for(var i = 0; i < ppl.length; i++){
    for(var j = 0; j < phone.length; j++){
      if(ppl[i].phoneNumbers[0].canonicalForm.indexOf(phone[j]) != -1){
        phone.splice(j,1);
      }
    }
  }
  return phone;
}

function findRowNotInPeopleList(ppl, data, phoneIndex){
    //ppl: array of JSON object Person
  //data: 2D array of data (in form: 1213991311)
  for(var i = 0; i < data.length; i++){ 
    if(data[i][phoneIndex].indexOf("0") == 0){
      data[i][phoneIndex] = data[i][phoneIndex].slice(1, data[i][phoneIndex].length).replace(" ","");
      continue;
    }
    
    if(data[i][phoneIndex].indexOf("+84") == 0){
      data[i][phoneIndex] = data[i][phoneIndex].slice(3, data[i][phoneIndex].length).replace(" ","");
      continue;
    }
    
    if(data[i][phoneIndex].indexOf("84") == 0){
      data[i][phoneIndex] = data[i][phoneIndex].slice(2, data[i][phoneIndex].length).replace(" ","");
      continue;
    }
  }

  for(var i = 0; i < ppl.length; i++){
    var isInPeopleList = false;
    for(var j = 0; j < data.length; j++){
      var phone = data[j][phoneIndex];
      if(ppl[i].phoneNumbers && ppl[i].phoneNumbers[0].canonicalForm.indexOf(phone) != -1){
        data.splice(j,1);
      }
    }
  }
  return data;
}

function testHamTren(){
    var ss = SpreadsheetApp.openById("11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA");
  var sheet = ss.getSheetByName("Members");
  var data = sheet.getRange("B5:K10").getValues();
  var phoneIndex = 8; //cot J
  var ppl = listConnectionNames(4);
    ppl.forEach(function(person) {
    if (person.names && person.names.length > 0) {
      Logger.log(person.names[0].displayName);
    } else {
      Logger.log('No display name found for connection.');
    }
    if(person.phoneNumbers && person.phoneNumbers.length > 0){
      Logger.log(person.phoneNumbers[0].canonicalForm);
    }
  });
  Logger.log(findRowNotInPeopleList(ppl, data, phoneIndex));
  
}

function createContactGroup(name){
  var resource = {
    contactGroup:{
      name:name
    }
  }
  return People.ContactGroups.create(resource);
}
