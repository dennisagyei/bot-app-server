var DialogFlowService       = require('../services/dialogflow_v2');
var WooStoreService         = require('../services/woocommerce');
var axios = require('axios').default;

//Notes
//https://developers.facebook.com/docs/whatsapp/cloud-api/guides
https://medium.com/@rishicentury/how-to-use-whatsapp-cloud-api-6c4b4a22fc34
const FB_BASE_URL = "https://graph.facebook.com/v14.0/";
const PHONE_NUMBER_ID = "";
const WHATSAPP_TOKEN = "";

function callSendAPI(messageData) {

    
    var data  = {
        messaging_product : "whatsapp",
        recipient_type : "individual",
        to : my_reciever ,
        type : "text",
        text : { // the text object
           preview_url : false,
           body : "MESSAGE_CONTENT"
        }
    };
  
    var config = {
        method: 'post',
        url: FB_BASE_URL+PHONE_NUMBER_ID/messages,
        headers: { 
          'Content-Type': 'application/json', 
          Authorization : "Bearer " + WHATSAPP_TOKEN,
        },
        data : messageData
    };

    
    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
}

  
function sendTextMessage(event,text) {
    console.log(event);
  var sender = event.sender.id;

  var messageData =  {
    messaging_product : "whatsapp",
    recipient_type : "individual",
    to : sender ,
    type : "text",
    text : { // the text object
       preview_url : false,
       body : text
    }
  };
        
        //send to facebook
        callSendAPI(messageData);
}

function sendImageMessage(event, imageUrl) {
          
        var sender = event.sender.id;
        
        var messageData =  {
            messaging_product : "whatsapp",
            recipient_type : "individual",
            to : sender ,
            type : "image",
            image : { 
                link : imageUrl
            }
        };

        callSendAPI(messageData);
}

function sendAudioMessage(event,audioUrl) {
    let sender = event.sender.id;
    
    var messageData =  {
        messaging_product : "whatsapp",
        recipient_type : "individual",
        to : sender ,
        type : "audio",
        audio : { 
            link : audioUrl
        }
    };
    
    callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 * example videoName: "/assets/allofus480.mov"
 */
function sendVideoMessage(event, videoName) {
    let sender = event.sender.id;
    
    var messageData =  {
        messaging_product : "whatsapp",
        recipient_type : "individual",
        to : sender ,
        type : "video",
        video : { 
            link : videoName
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 * example fileName: fileName"/assets/test.txt"
 */
function sendFileMessage(event, document) {
    let sender = event.sender.id;
    
    var messageData =  {
        messaging_product : "whatsapp",
        recipient_type : "individual",
        to : sender ,
        type : "document",
        video : { 
            link : document
        }
    };

    callSendAPI(messageData);
}

function sendLocationMessage(event, LONG_NUMBER,LAT_NUMBER,LOCATION_NAME,LOCATION_ADDRESS) {
    let sender = event.sender.id;
    
    var messageData =  {
        messaging_product : "whatsapp",
        to : sender ,
        type : "location",
        location : {
            "longitude": LONG_NUMBER,
            "latitude": LAT_NUMBER,
            "name": LOCATION_NAME,
            "address": LOCATION_ADDRESS
          }
    };

    callSendAPI(messageData);
}

function sendContactMessage(event,EMAIL,NAME,PHONE_NUMBER ) {
    let sender = event.sender.id;
    
    var messageData =  {
        messaging_product : "whatsapp",
        to : sender ,
        type : "contacts",
        contacts : [{
            
            emails: [{
                email : EMAIL,
                type : "WHOMEORK"
              }],
             name : {
               formatted_name :  NAME ,
             },
             phones : [{
                "phone": PHONE_NUMBER ,
                "type": "HOME"
              }]
          }]
    };

    callSendAPI(messageData);
}

    
function sendReplyToMessage(event,text, REPLY_MESSAGE_ID) {
        var sender = event.sender.id;
        
        var messageData =  {
            messaging_product : "whatsapp",
            context : {
                message_id : REPLY_MESSAGE_ID
            },
            to : sender ,
            type : "text",
            text : { // the text object
               preview_url : false,
               body : text
            }
          };

        callSendAPI(messageData);
}
    
/*
     * Send a button message using the Send API.
     *
*/
function sendButtonMessage(event,text, buttons) {
        
        var sender = event.sender.id;

        buttons=JSON.stringify(buttons);

        //sample button
        button =[
            {
              "type": "reply",
              "reply": {
                "id": "UNIQUE_BUTTON_ID_1",
                "title": "BUTTON_TITLE_1"
              }
            },
            {
              "type": "reply",
              "reply": {
                "id": "UNIQUE_BUTTON_ID_2",
                "title": "BUTTON_TITLE_2"
              }
            }
        ]

        var messageData =  {
                messaging_product : "whatsapp",
                recipient_type : "individual",
                to : sender ,
                type : "interactive",
                interactive : {
                    type: "button",
                    body : {
                      text : "BUTTON_TEXT"
                    },
                    action : {
                      buttons : buttons
                    }
                  }
          };
        
        callSendAPI(messageData);
}


function sendListMessage(event,HEADER_TEXT,BODY_TEXT,FOOTER_TEXT, listOfSections ) {
        
        
        var sender = event.sender.id;
        
        listOfSections =JSON.stringify(listOfSections);

        //sample sections
        listOfSection =[
                            {
                                "title": "SECTION_1_TITLE",
                                "rows": [
                                            {
                                                "id": "SECTION_1_ROW_1_ID",
                                                "title": "SECTION_1_ROW_1_TITLE",
                                                "description": "SECTION_1_ROW_1_DESCRIPTION"
                                            },
                                            {
                                                "id": "SECTION_1_ROW_2_ID",
                                                "title": "SECTION_1_ROW_2_TITLE",
                                                "description": "SECTION_1_ROW_2_DESCRIPTION"
                                            }
                                        ]
                            }    
                        ]            
        
        var messageData = {
            messaging_product : "whatsapp",
            recipient_type : "individual",
            to : sender,
            type : "interactive",
            interactive : {
            type : "list",
            header : {
                 type : "text",
                 text : HEADER_TEXT
            },
            body : {
                 text : BODY_TEXT
            },
            footer : {
                text : FOOTER_TEXT
            },
            action : {
                button : "BUTTON_TEXT",
                sections : listOfSections
            }
        }
        
        callSendAPI(messageData);
}
    /*
     * Send a read receipt to indicate the message has been read
     *
     */
function sendReadReceipt (event) {
        
        var sender = event.sender.id;
        
        console.log("Sending a read receipt to mark message as seen");

        var messageData = {
            recipient: {
                id: sender
            },
            sender_action: "mark_seen"
        };

        callSendAPI(messageData);
}
    

function sendGetStarted(event) {
    
    var elements= [
            {
               title :"Welcome to InstantPro online store",
               image_url :"http://bot-app-server-dennisagyei.c9users.io/images/instantpro/banner7_10-1-1024x366.jpg",
               subtitle :"Risk Free Shopping",
               
               buttons :[
                    {
                         type :"web_url",
                         url :"https://ipro.com.gh",
                         title :"Visit Website"
                    },{
                         type :"postback",
                         title :"Start Shopping",
                         payload :"START_SHOPPING_PAYLOAD"
                      }
                   ]      
            }
        ]
    sendGenericMessage(event,elements);  
}


function sendStartShoppingPanel(event){
    
    
    var msg = 'I am here to help you find what you need. What are you looking for?';
    
    var buttons = [
                    {
                        type:"postback",
                        title:"Product Search",
                        payload:"PRODUCT_SEARCH_PAYLOAD"
                    },
                    {
                        type:"postback",
                        title:"Featured Products",
                        payload:"PRODUCT_FEAT_PAYLOAD"
                    },
                    
                    {
                        type :"postback",
                        title :"Track Order",
                        payload :"TRACK_ORDER_PAYLOAD"
                    }
                ];
            
            
    sendButtonMessage(event,msg,buttons);
   //sendGenericMessage(event,elements);
}

function sendShowProductsPanel(event){
    
            
             var products_elements;
            var promise=WooStoreService.getFeaturedProducts();
            
            
            promise.then(
                  function(result) { /* handle a successful result */ 
                    var products_data=JSON.parse(result.body).products;
                    
                    var elements = [];
            
                    products_data.forEach(function(item, index, array) {
                      //console.log(item.title);
                      products_elements=  {
                                                 title :item.title,
                                                 image_url :item.images[0].src,
                                                 subtitle : item.regular_price,
                                                 
                                                 buttons :[
                                                      {
                                                           type :"web_url",
                                                           url :item.permalink,
                                                           title :"Check on Website"
                                                      },{
                                                           type :"postback",
                                                           title :"Add to Cart",
                                                           payload :"ADD_CART_PAYLOAD"
                                                        }
                                                     ]      
                                              }
                                          
                      
                      //At to the end of array
                      elements.push(products_elements);
                      
                      console.log(JSON.parse(elements));
        
                    });
            
                    //sendGenericMessage(event,products_elements);
                  },
                  function(error) { /* handle an error */ 
                      console.log('Error occurred!', error);
                  }
            );
            
            
}

function setupGreetingText(){
    var messageData = {
         greeting :[
            {
             locale :"default",
             text :"Hello {{user_first_name}}! Welcome to Instant Pro Online Store"
            }
    ]};
    
    
    request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ process.env.FB_PAGE_ACCESS_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if (error) {
            // Print out the response body
            console.log('setupGreetingText:', error);
        }
        
    
    });

}

function setupPersistentMenu(){
  var messageData = 
    {"persistent_menu":[
        {
        "locale":"default",
        "composer_input_disabled":false,
        "call_to_actions":[
            {
            "title":"My Account",
            "type":"nested",
            "call_to_actions":[
                {
                "title":"Change Password",
                "type":"postback",
                "payload":"HELP_PAYLOAD"
                },
                {
                "title":"Contact Info",
                "type":"postback",
                "payload":"CONTACT_INFO_PAYLOAD"
                }
            ]
            },
            {
            "type":"web_url",
            "title":"Visit website ",
            "url":"https://ipro.com.gh",
            "webview_height_ratio":"full"
            }
        ]
        },
        {
        "locale":"zh_CN",
        "composer_input_disabled":false
        }
    ]};  
    // Start the request
    request({
        url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token="+ process.env.FB_PAGE_ACCESS_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if (error) {
            // Print out the response body
            console.log('setupPersistentMenu:'.error);
        }
    });

}


function setupGetStartedButton(){
  var messageData = {
          "get_started":{
              "payload":"GET_STARTED_PAYLOAD"
          }
  };
  // Start the request
  request({
      url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token="+ process.env.FB_PAGE_ACCESS_TOKEN,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      form: messageData
  },
  function (error, response, body) {
      if (error) {
          // Print out the response body
          console.log('setupGetStartedButton:',error);
  
      }
      
      
  });
} 

function setupPersona(){
  var messageData = {
          name: "Nhyira M.",
	      profile_picture_url: "http://bot-app-server-dennisagyei.c9users.io/images/Male-Face-G3-icon.png",
  };
  // Start the request
  request({
      url: "https://graph.facebook.com/me/personas?access_token="+ process.env.FB_PAGE_ACCESS_TOKEN,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      form: messageData
  },
  function (error, response, body) {
      if (error) {
          // Print out the response body
          console.log('setupPersona:',error);
  
      }
  });
}

function getUserProfile(PSID){
    
    var apiUrl="https://graph.facebook.com/"+PSID+"?fields=first_name,last_name,profile_pic&access_token="+process.env.FB_PAGE_ACCESS_TOKEN;
    
    request(apiUrl, function (error, response, body) {
      //console.log('error:', error); // Print the error if one occurred
      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //console.log('body:', body); // Print the HTML for the Google homepage.
      return body;
    });
}

function processMessage(event,sessionId) {

	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;

    //setSessionAndUser(senderID);
    //getUserProfile(senderID);
	//console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
	//console.log(JSON.stringify(message));

	var isEcho = message.is_echo;
	var messageId = message.mid;
	var appId = message.app_id;
	var metadata = message.metadata;

	// You may get a text or attachment but not both
	var messageText = message.text;
	var messageAttachments = message.attachments;
	var quickReply = message.quick_reply;

	/*if (isEcho) {
        handleEcho(messageId, appId, metadata);
		return;
	} else if (quickReply) {
        handleQuickReply(senderID, quickReply, messageId);
		return;
	}*/


	if (messageText) {
		//send message to DialogFlow
        DialogFlowService.fb_sendTextQueryToDialogFlow(sessionId,process.env.ECOMM_project_id,process.env.ECOMM_private_key,process.env.ECOMM_client_email, handleDialogFlowResponse, event);
	} else if (messageAttachments) {
        handleMessageAttachments(messageAttachments, event);
	}
}

function handleMessageAttachments(messageAttachments, event){
        //for now just reply messageAttachments[0].payload.url
        sendTextMessage(event, "Attachment received. Thank you.");
}

    //https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-echo
function    handleEcho(messageId, appId, metadata) {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
}
function handleDialogFlowResponse(event, response) {
    let responseText = response.fulfillmentText;

    let messages = response.fulfillmentMessages;
    let action = response.action;
    let contexts = response.outputContexts;
    let parameters = response.parameters;

    sendTypingOff(event);
    
    //console.log('response',response);
    
    if (isDefined(action)) {
        handleDialogFlowAction(event, action, responseText, contexts, parameters);
    } else if (isDefined(messages)) {
        //handleMessages(messages, sender);
	} else if (responseText == '' && !isDefined(action)) {
		//dialogflow could not evaluate input.
        sendTextMessage(event, "I'm not sure what you want. Can you be more specific?");
	} else 	if (isDefined(responseText)) {
        sendTextMessage(event, responseText);
	}
}

function handleDialogFlowAction(event, action, messages, contexts, parameters) {
    
	switch (action) {
        case "input.unknown":
            sendTextMessage(event,messages);
            
            sendTypingOn(event);

            //ask what user wants to do next
            setTimeout(function() {
                let responseText = "Can you please refrain your question or click the button to talk to a live agent. " +
                    "I'm just a bot.";

                let replies = [
                    {
                        "content_type": "text",
                        "title": "Live agent",
                        "payload": "LIVE_AGENT"
                    }
                ];

                //sendQuickReply(sender, responseText, replies);
            }, 2000);

            break;
        case "smalltalk.greetings.hello":
            sendGetStarted(event);
            break;
        case "talk.human":
            //sendPassThread(sender);
            break;
            
        default:
			//unhandled action, just send back the text
            sendTextMessage(event,messages);
	}
            
}

function processPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var payload = event.postback.payload;
    
    switch(payload)
    {
        case 'GET_STARTED_PAYLOAD':
           
            sendGetStarted(event);

            break;
        case 'START_SHOPPING_PAYLOAD':
            sendStartShoppingPanel(event);
            
            break;
        case 'PRODUCT_FEAT_PAYLOAD':
            sendShowProductsPanel();
            break;
        default :
            var msg = "Implement logic for this Postback";
            sendTextMessage(event,msg); 
        break;
    }

}
        
function isDefined(obj) {
        if (typeof obj == 'undefined') {
            return false;
        }

        if (!obj) {
            return false;
        }

        return obj != null;
    }        
      
module.exports = {sendTextMessage,processMessage,processPostback,setupGreetingText,setupGetStartedButton,setupPersistentMenu,setupPersona};