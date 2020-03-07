//function setProps() {
//  var props = PropertiesService.getUserProperties();
//  props.setProperty("Test", "Fail");
//}

function testGetLabel(){
  console.log(GmailApp.getUserLabelByName("Status changed").getName());
}

function TestJSONAgain(){
  var name = "abc";
  var namename = "def";
  var a = {
    name:name
  }
  
  a[namename] = "def";
  
  Logger.log(JSON.stringify(a, null, '\n'));
}

function TestGlobal(){
  Logger.log(RECURRING_KEY);
}

function TestJSON(){
  var a = {
    name:'expat',
    day: '15/9'
  }
//  Logger.log(a);
//  Logger.log(a['name']);
//  var json = JSON.stringify(a);
//  Logger.log(json);
//  var json = JSON.parse(json);
//  Logger.log(json);
//  Logger.log(json['name']);
  
  var b = {};
  b['data'] = JSON.stringify(a);
  
  b=JSON.stringify(b);
  Logger.log(b);
  b = JSON.parse(b);
  Logger.log(JSON.parse(b['data']));
}  
function Test(){
  // Get first 50 chat threads
  var threads = GmailApp.getInboxThreads(0,50);
  // Will log no more than 50.0
  Logger.log(threads.length);
  for (var thread in threads){
    Logger.log(thread.getFirstMessageSubject());
  }
}

function TestOJB(obj){
  Logger.log(JSON.stringify(obj));
  Logger.log(obj.time);
}


function testEmailCaller(){
  var arr = [];
  arr.push("A\na");
  testEmail(arr);
}

function testForeach(){
  var a = [9,8,7,6,5];
  for(var num of a){
    Logger.log(num);
  }
}

function example() {
  var trigger = ScriptApp.newTrigger("exampleTriggerFunction").timeBased()
    .after(1000)
    .create();

  setupTriggerArguments(trigger, {'1':'a'}, false);
}

function exampleTriggerFunction(event) {
  var functionArguments = handleTriggered(event.triggerUid);
  console.info("Function arguments: %s", functionArguments);
}