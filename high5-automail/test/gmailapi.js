//////////////////////////////////////////////
// NOT USED
//
//////////////////////////////////////////////


function sendHTML(){
    var forScope = GmailApp.getInboxUnreadCount(); //needed for authentication
    
    //build, encode, upload draft
    
    var someUser = 'hhoang.nov.13@gmail.com';
    
    var r = new RAW_();
    r.From = 'High5 Hanoi <' + 'high5hanoi@gmail.com' + '>';
    r.To = 'Some User <' + someUser + '>';
    r.Subject = 'New Email!';
    // r.body = '<html><body>' + 'You have a new email!' + '</body></html>';
    r.body = getDraftBodyById("r-5318680169226253490");
    var draftBody = r.encode();
    
    var params =
    {
        method: "post", 
        contentType: "application/json", 
        headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()}, 
        muteHttpExceptions: true,
        payload:JSON.stringify({'message': {'raw': draftBody}})
    };
    
    
    var resp = UrlFetchApp.fetch('https://www.googleapis.com/gmail/v1/users/me/drafts', params);
    draftID = /: "(.*)"/.exec(resp.getContentText())[1];
    
    // use draft ID to send newly created draft
    
    params =
        {
          method: "post", 
          contentType: "application/json", 
          headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()}, 
          muteHttpExceptions: true, 
          payload: JSON.stringify({ "id": draftID }) 
        };
    
    resp = UrlFetchApp.fetch("https://www.googleapis.com/gmail/v1/users/me/drafts/send", params);
    Logger.log(resp.getResponseCode());
    Logger.log(resp.getContentText());
}
    
    //builds RFC spec headers
    
class RAW_ {
    constructor() {
        this['prOrder_'] = ['From', 'To', 'Subject', 'MIME-Version', 'Content-Transfer-Encoding', 'Content-Type'];
        // this['prOrder_'] = ['From', 'To', 'Subject', 'MIME-Version', 'Content-Type'];
        this['From'] = ' ';
        this['To'] = ' ';
        this['Subject'] = ' ';
        this['MIME-Version'] = '1.0';
        this['Content-Transfer-Encoding'] = 'BASE64';
        this['Content-Type'] = 'text/html; charset=UTF-8';
        this['body'] = ' ';
    }
    toRFC() {
        var line = '';
        for (var i = 0; i < this.prOrder_.length; i++) {
            line += this.prOrder_[i] + ': ' + this[this.prOrder_[i]] + '\r\n';
        }
        line += '\r\n' + this['body'];
        return line;
    }
    //uses regex to replace some problematic characters
    encode() {
        return Utilities.base64Encode(this.toRFC(), Utilities.Charset.UTF_8).replace(/\//g, '_').replace(/\+/g, '-');
    }
}
    
    
