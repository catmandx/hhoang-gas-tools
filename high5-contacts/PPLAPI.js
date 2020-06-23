function listConnectionNames(size) {
  var connections = People.People.Connections.list('people/me', {
    pageSize: size,
    personFields: 'names,emailAddresses,phoneNumbers'
  });
//  Logger.log(JSON.stringify(connections));
//  connections.connections.forEach(function(person) {
//    if (person.names && person.names.length > 0) {
//      Logger.log(person.names[0].displayName);
//    } else {
//      Logger.log('No display name found for connection.');
//    }
//    if(person.phoneNumbers && person.phoneNumbers.length > 0){
//      Logger.log(person.phoneNumbers[0].value);
//    }
//  });
  return connections.connections;
}

function listContactGroups(){
  var groups = People.ContactGroups.list();
  groups.contactGroups.forEach(function(contactGroup){
    Logger.log(contactGroup.name);
  })
}

function addContacts(){
  var dataRange = "B5:K100";
  var titleList = {
    'MD': 'Media Department',
    'HR': 'Human Resources',
    'ED': 'Event Department',
    'CT': 'President',
    'CM': 'Class Management',
    'fo': 'President',
    'LD': 'Logistics Department'
  }
  var ss = SpreadsheetApp.openById("11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA");
  var sheet = ss.getSheetByName("Active Members");
  var lastRow = sheet.getLastRow();
  var row = 0;
  var str = "";
  
  var contacts = People.ContactGroups.get("contactGroups/myContacts");
  var high5Group = createContactGroup("High5 Hanoi")
  var addReqBody = {
    "resourceNamesToAdd": [],
    "resourceNamesToRemove": []
  }
  
  var data = sheet.getRange(dataRange).getValues();
  var phoneIndex = 8; //J column
  var ppl = listConnectionNames(300);
  if(!ppl){ppl = []}
  data = findRowNotInPeopleList(ppl, data, phoneIndex);

  for(var i = 0; i<data.length; i++){
    var stt = data[i][0];
    if(stt && !isNaN(stt)){
      var fullName = data[i][1].trim();
      var nickName = data[i][2].trim();
      if(nickName.indexOf("SP") == 0){
        continue;
      }
      var email = data[i][7].trim();
      var phone = data[i][8].trim();
      if(phone.indexOf("'") == 0){
        phone = phone.subString(1, phone.length).trim();
      }
      var facebook = data[i][9].trim();
      
      var person = {
        "names": [
          {
            "givenName":nickName
          }
        ],
        "emailAddresses": [
          {
            "value":email
          }
        ],
        "phoneNumbers": [
          {
            "value":phone
          }
        ],
        "urls": [
          {
            "value":facebook
          }
        ],
        "organizations": [
          {
            "name": "High5 Hanoi",
            "title": titleList[nickName.substring(0,2)],
          }
        ]
      }
      Utilities.sleep(800);
      var response = People.People.createContact(person);
      addReqBody["resourceNamesToAdd"].push(response.resourceName);
    }
  }
  var req = People.ContactGroups.Members.modify(addReqBody, high5Group.resourceName);
}