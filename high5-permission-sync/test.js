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

  //array of sync items (DriveApp)
  // var syncItems = 
  //   [
  //     {
  //       type:"file",
  //       description:"Sheet Active members",
  //       link:"https://docs.google.com/spreadsheets/d/11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA/edit",
  //       id:"11IcDpPKb-CXlN724c9J5PbickjgoSIQkFJwlgi2-LIA",
  //       permission:"edit",
  //       defaultEditList: ["hrhigh5hanoi@gmail.com", 
  //                         "hhoang.nov.13@gmail.com",
  //                         "high5hanoi@gmail.com",
  //                         "cm.high5hanoi@gmail.com",
  //                         "mdhigh5material@gmail.com",
  //                         "edhigh5hanoi@gmail.com", 
  //                         "high5hanoi.edu.vn@gmail.com", 
  //                         "logistics.high5hanoi@gmail.com"],
  //       defaultViewList: []
  //     },
  //     {
  //       type: "file",
  //       description:"Sheet Expats' orders",
  //       link:"https://docs.google.com/spreadsheets/d/1-ZGqLy2Qn4jtPt8TJYaEArK4TwYyRkRYxYgDu4C_eyA/edit",
  //       id:"1-ZGqLy2Qn4jtPt8TJYaEArK4TwYyRkRYxYgDu4C_eyA",
  //       permission:"edit",
  //       defaultEditList: ["high5hanoi@gmail.com", 
  //                         "cm.high5hanoi@gmail.com", 
  //                         "hrhigh5hanoi@gmail.com", 
  //                         "mdhigh5material@gmail.com",
  //                         "edhigh5hanoi@gmail.com", 
  //                         "high5hanoi.edu.vn@gmail.com", 
  //                         "hhoang.nov.13@gmail.com",
  //                         "logistics.high5hanoi@gmail.com"],
  //       defaultViewList: []
  //     },
  //     {
  //       type:"folder",
  //       description:"Folder giao trinh 2018",
  //       link:"https://drive.google.com/drive/folders/1pkiRE5SlhmYLk0WxHx9l0z4C7T6rcgai?usp=sharing",
  //       id:"1pkiRE5SlhmYLk0WxHx9l0z4C7T6rcgai",
  //       permission:"view",
  //       defaultEditList: ["cm.high5hanoi@gmail.com",
  //                         "hhoang.nov.13@gmail.com",
  //                         "high5hanoi@gmail.com"],
  //       defaultViewList: ["hrhigh5hanoi@gmail.com", 
  //                         "mdhigh5material@gmail.com",
  //                         "edhigh5hanoi@gmail.com", 
  //                         "high5hanoi.edu.vn@gmail.com",
  //                         "logistics.high5hanoi@gmail.com"]
  //     }
  // ];