const request      = require('request');

function db_initialize_session(sessionID,socketID){
    
    var options = {  
        url: 'http://localhost:'+process.env.PORT+'/api/chatsession',
        form: {
            session_id: sessionID,
            socket_id: socketID,
            authenticated: 0
        }
    };
    
    request.post(options,  function (error, response, body) {
        if (error){
          console.log('error', error);
        }
          //console.log('response', response);
          //console.log('body', body);
    });  

}

function db_end_session(sessionID){
    
    var options = {  
        url: 'http://localhost:'+process.env.PORT+'/api/chatsession/'+sessionID,
        form: {
            session_end: Date.now()
        }
    };
    
    request.put(options,  function (error, response, body) {
        if (error){
          console.log('error', error);
        }
          //console.log('response', response);
          //console.log('body', body);
    });  

}

function generate_otp(sessionid){
    
    var speakeasy_otp = require("speakeasy");
    
    // alternativley Generate a secret key.
    //var secret = speakeasy_otp.generateSecret({length: 20});
    
    // Generate a time-based token based on the base-32 key.
    // HOTP (counter-based tokens) can also be used if `totp` is replaced by
    // `hotp` (i.e. speakeasy.hotp()) and a `counter` is given in the options.
    var token = speakeasy_otp.totp({
      secret: sessionid,
      encoding: 'base32'
    });
    
    return token;
}

function db_generate_otp(sessionID){
    
    var options = {  
        url: 'http://localhost:'+process.env.PORT+'/api/chatsession/'+sessionID,
        form: {
            otp: generate_otp(sessionID)
        }
    };
    
    request.put(options,  function (error, response, body) {
        if (error){
          console.log('error', error);
        }
          //console.log('response', response);
          //console.log('body', body);
    });  

}

function db_authenticated(sessionID){
    
    var options = {  
        url: 'http://localhost:'+process.env.PORT+'/api/chatsession/'+sessionID,
        form: {
            authenticated: 1
        }
    };
    
    request.put(options,  function (error, response, body) {
        if (error){
          console.log('error', error);
        }
          //console.log('response', response);
          //console.log('body', body);
    });  

}

function db_confirm_authentication(sessionID){
    
    var options = {  
        url: 'http://localhost:'+process.env.PORT+'/api/chatsession/'+sessionID,
    };
    
    request.get(options,  function (error, response, body) {
        
         var info = JSON.parse(body);
         
         return info.authenticated
          //console.log('response', response);
          //console.log('body', body);
    });  

}

function verify_otp (otp_secret,userToken){
    
    var speakeasy_otp = require("speakeasy");
    // Use verify() to check the token against the secret
    var verified = speakeasy_otp.totp.verify({ secret: otp_secret,
                                       encoding: 'base32',
                                       token: userToken });
                                       
    return verified;
}


function db_log_message(sessionID,messageType,message){
    
    var options = {  
        url: 'http://localhost:'+process.env.PORT+'/api/chatmessage',
        form: {
            session_id: sessionID,
            message_type: messageType,
            message : message
        }
    };
    
    request.post(options,  function (error, response, body) {
        if (error){
          console.log('error', error);
        }
          //console.log('response', response);
          //console.log('body', body);
    });  

}

module.exports = {db_initialize_session,generate_otp,verify_otp,db_end_session,db_generate_otp,db_confirm_authentication,db_authenticated,db_log_message};