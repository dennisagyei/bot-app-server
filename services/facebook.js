const request               = require('request');
var DialogFlowService       = require('./dialogflow');
var WooStoreService         = require('../services/woocommerce');

function sendTextMessage(event,text) {
    console.log(event);
  var sender = event.sender.id;

  var messageData = {
            recipient: {
                id: sender
            },
            message: {
                text: text
            }
        }
        
        //send to facebook
        callSendAPI(messageData);
}

function sendImageMessage(event, imageUrl) {
          
        var sender = event.sender.id;
        
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: imageUrl
                    }
                }
            }
        };

        callSendAPI(messageData);
}
    
function sendQuickReply(event,text, replies, metadata) {
        var sender = event.sender.id;
        
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                text: text,
                metadata: isDefined(metadata)?metadata:'',
                quick_replies: replies
            }
        };

        callSendAPI(messageData);
}
    
function callSendAPI(messageData) {
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: process.env.FB_PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: messageData
    
  }, function (error, response, body) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}


    /*
     * Send audio using the Send API.
     *
     */
function sendAudioMessage(event) {
        let sender = event.sender.id;
        
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                attachment: {
                    type: "audio",
                    payload: {
                        url: config.SERVER_URL + "/assets/sample.mp3"
                    }
                }
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
        
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                attachment: {
                    type: "video",
                    payload: {
                        url: config.SERVER_URL + videoName
                    }
                }
            }
        };

        callSendAPI(messageData);
}

    /*
     * Send a video using the Send API.
     * example fileName: fileName"/assets/test.txt"
     */
function sendFileMessage(event, fileName) {
        let sender = event.sender.id;
        
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                attachment: {
                    type: "file",
                    payload: {
                        url: config.SERVER_URL + fileName
                    }
                }
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
        
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text,
                        buttons: buttons
                    }
                }
            }
        };
        
        callSendAPI(messageData);
}


function sendGenericMessage(event, elements) {
        
        
        var sender = event.sender.id;
        
        elements=JSON.stringify(elements);
 
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: elements
                    }
                }
            }
        };
        
        //console.log(JSON.stringify(messageData))
        callSendAPI(messageData);
}

function sendListMessage(event, elements) {
        
        
        var sender = event.sender.id;
        
        elements=JSON.stringify(elements);
        
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "list",
                        top_element_style: "COMPACT", //"<LARGE | COMPACT>",
                        elements: [elements]
                    }
                }
            }
        };
        
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
    /*
     * Turn typing indicator on
     *
     */
function    sendTypingOn (event) {
        
        let sender = event.sender.id;

        var messageData = {
            recipient: {
                id: sender
            },
            sender_action: "typing_on"
        };

        callSendAPI(messageData);
}

    /*
     * Turn typing indicator off
     *
     */
function sendTypingOff(event) {
        
        let sender = event.sender.id;
        
        //console.log("Turning typing indicator off");
        var messageData = {
            recipient: {
                id: sender
            },
            sender_action: "typing_off"
        };

        callSendAPI(messageData);
}


    /*
     * Send a message with the account linking call-to-action
     *
     */
function sendAccountLinking(event) {
    
    let sender = event.sender.id;
    
        var messageData = {
            recipient: {
                id: sender
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "Welcome. Link your account.",
                        buttons: [{
                            type: "account_link",
                            url: config.SERVER_URL + "/authorize"
                        }]
                    }
                }
            }
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