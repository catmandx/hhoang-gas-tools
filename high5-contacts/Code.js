function onOpen(e) {
  SpreadsheetApp.getUi().createMenu("Add contacts")
                        .addItem("Give permission", "getPermission")
                        .addItem("Add contacts to Google Account", 'addContacts')
                        .addItem("Help", "openHelp")
                        .addToUi();
}

function getPermission(){
  var ss = SpreadsheetApp.openById("11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA");
  var connections = People.People.Connections.list('people/me', {
    pageSize: 100,
    personFields: 'names,emailAddresses,phoneNumbers'
  });
}

function openHelp(){
  var js = " \
    <script> \
window.open('https://tanaikech.github.io/', '_blank', 'width=800, height=600'); \
google.script.host.close(); \
</script> \
";
  var html = HtmlService.createHtmlOutput(js)
  .setHeight(10)
  .setWidth(100);
  SpreadsheetApp.getUi().showModalDialog(html, 'Now loading.');
}