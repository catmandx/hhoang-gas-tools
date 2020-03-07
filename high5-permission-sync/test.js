function test(){
    var emailArr = ["hoanghamho99@gmail.com", "a@abv.com", "a a@.com"];
    Logger.log(emailArr.filter(function(email){
        try{
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email.trim());
        }catch(ex){
          return false;
        }
    }))
  }