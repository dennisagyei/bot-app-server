// app/routes.js
module.exports = function(app) 
{       
      
      const AccessKey='DyMqcDmpcYGI1atUup4Hat7DSPemkNuO';
          
      var sms                = require('../services/mnotify');
      var openWeather        = require('../services/openweather');
      //var woocommerce        = require('../services/woocommerce');
      var db_func            = require('../services/general');
      var DialogFlowService  = require('../services/dialogflow');
      //var FacebookService    = require('../services/facebook');
      
      var Request = require("request");    
      var path    = require('path');
      var uuid    = require('uuid');
      
      var sessionId = uuid.v4();
      
      
      
          app.get('/api', function (req, res) {
            res.send('API Version 1.0 is running');
          });

          app.get('/api/v1/banks', function (req, res) {

            var clientApiKey = req.query.api_key;

            //console.log(clientApiKey)

            if(!clientApiKey){
              return res.status(400).send({status:false,response:"Missing Api Key" }); 
            }

            if(clientApiKey!='3xWA0xpLCqczP3tvaOOU0KXH'){
              return res.status(400).send({status:false,response:"Invalid Api Key" }); 
            }


            var jsonData = require('./banks.json');
            res.status(200).send(jsonData);
          });
          
          
          //================================================================================================================================
          //                          PAGE    NAVIGATION          
          //================================================================================================================================
          app.get('/', function (req, res) {
            res.sendFile('index.html');
          });
          
          app.get('/demo/ecom-bot', function (req, res) {
            //res.sendFile('./client/demo.html');
            res.sendFile('ecommDemo.html', { root: './client' });
          });
          
          app.get('/demo/faq-bot', function (req, res) {
            //res.sendFile('./client/demo.html');
            res.sendFile('demo.html', { root: './client' });
            
          });
          
          app.get('/demo/bank-bot', function (req, res) {
            res.sendFile('bankdemo.html', { root: './client' });
          });
          
          
          
          //================================================================================================================================
          //                         TEST DIALOG FLOW WEB HOOKS         
          //================================================================================================================================
          app.post('/api/webhook',function (req,res){
            
              if (req.headers['access_token']!=AccessKey)
              return res.status(500).json({ error: 'Invalid Access Key' });
	
            	if (!req.body.queryResult) return res.sendstatus(400)
            		
            	res.setHeader('Content-type','application/json');
            	
            	//check for action
            	if (req.body.result.action === 'weather') {
                  let city = req.body.result.parameters['geo-city'];
                  let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID='+WEATHER_API_KEY+'&q='+city;
            	}
            	
            	var city = req.body.queryResult.parameters['geo-city'];
            	//var w=getWeather(city);
            	//const bnk_promise=getATMLocations();
            	 
            	//swedBankGetConsent();
            	//wp_get_customers();
              const promise = openWeather.getWeather(city);

              promise.then((result) => {
                //console.log('Got data!', result);
                let response ='Right now its '+ JSON.stringify(result.main.temp)  + ' degrees' + ' with ' + result.weather[0].description; //default response from the webhook to show its working
            	  
            	  //ref : https://dialogflow.com/docs/reference/api-v2/rest/Shared.Types/Message
            	  
              	let responseObj={
              						"fulfillmentText": response,
              						"fulfillmentMessages": [],
              						"source": "Bot Weather Backend Service"
              					}
              					
                //console.log('Here is the response to DialogFlow');
            	  //console.log(responseObj);
            	
            	  return res.json(responseObj)
              					
              }).catch((error) => {
                console.log('Error occurred!', error);
              });
              
              
             
            
          });
          
          //================================================================================================================================
          //                          twilio WhatsApp  WEB HOOKS         
          //================================================================================================================================
          app.post('/api/twilio/webhook',function (req,res){
            
            
            //console.log('sent',req.body);
            var promise = DialogFlowService.getRes(req.body.Body,sessionId);
            db_func.db_log_message(sessionId,'sent',req.body.Body);
            
            
            //get reply
            
            
            promise.then(
                  function(result) { /* handle a successful result */ 
                  
                  //console.log('rely',result);
                    const MessagingResponse = require('twilio').twiml.MessagingResponse;
                    const twiml = new MessagingResponse();
                    twiml.message(result[0].queryResult.fulfillmentText);  //reply to message
                    
                    res.writeHead(200, { 'Content-Type': 'text/xml' });
                    res.end(twiml.toString());
                    
                    db_func.db_log_message(sessionId,'recieved',result[0].queryResult.fulfillmentText);
                  },
                  function(error) { /* handle an error */ 
                      console.log('Error occurred!', error);
                  }
            );
            
            
                  
          });
          
          
          //================================================================================================================================
          //                          FACEBOOK DialogFlow  WEB HOOKS         
          //================================================================================================================================
          // for Facebook verification
          app.get("/api/facebook/webhook", function (req, res) {

            if (
              req.query["hub.mode"] === "subscribe" &&
              req.query["hub.verify_token"] === process.env.FB_VERIFY_TOKEN
            ) {
              res.status(200).send(req.query["hub.challenge"]);
              console.log('verified');
            } else {
              console.error("Failed validation. Make sure the validation tokens match.");
              res.sendStatus(403);
            }
          });
          
          
          app.post('/api/facebook/webhook',function (req,res){
            /* Handling all messenges from Facebook messenger*/
            //console.log(req.body);
            if (req.body.object === 'page') {
              req.body.entry.forEach((entry) => {
                entry.messaging.forEach((event) => {
                  
                  if (event.message && event.message.text) {
                      
                      FacebookService.processMessage(event,sessionId);  
                  } else if(event.postback)
                  {
                      //present user with  call to action
                      FacebookService.processPostback(event);
                  } else {
                      console.log("Webhook received unknown messagingEvent: ", event);
                  }   
                  
                });
              });
              res.status(200).end();
              
            }
            
            
           
    
          });
          
         
          
          //================================================================================================================================
          //                          BankBot DialogFlow  WEB HOOKS         
          //================================================================================================================================
          app.post('/api/bank/webhook',function (req,res){
            
            console.log(req.body);
            return res.json('This is a response from webhook')
          });
          
          function getIPinfo(){
            
            Request.get("https://ipinfo.io", { json: true }, function(error, response) {
              if(error) {
                  return console.log(error);
              }
              console.log(response.body);
              
            })
            
          };
          
          
          
          function getBibleVerse(strVerse){
            const api_url = encodeURI(`https://bible-api.com/${strVerse}`);
            
            var api_response;
            
            return new Promise(function(resolve, reject) {
              Request.get(api_url, { json: true }, function(error, response,body) {
                if (error) return reject(error);
                
                api_response = body;
          
                resolve(api_response);
                 
              });
            });
            
          };
          
          
          function swedBankGetConsent(){
              
              var request = require('request');
              var url = 'https://psd2.api.swedbank.com/sandbox/v1/consents/';
              var queryParams = '?' + encodeURIComponent('BIC') + '=' + encodeURIComponent('SANDSESS');
              
              
              request({
                url: url + queryParams,
                headers: { 'apikey':'l7d5cee34d00814b78beddce7be5e9e812','Date':'2008-01-01','authorization':'Bearer dummyToken','Request-ID':'TPP-request-ID','Process-ID':'TPP-process-ID' },
                method: 'GET'
              }, function (error, response, body) {
                //console.log('Status', response.statusCode);
             
                console.log('Reponse received', body);
              });
              
          };
          
          
          
          
         
          
            
    
          
    
};