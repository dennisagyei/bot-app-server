#!/usr/bin/env nodejs
// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var path           = require('path');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var server         = require('http').Server(app);
var io             = require('socket.io')(server);
const dotenv       = require('dotenv')
const uuid         = require('uuid');
var helmet         = require('helmet')


//Initiallize Enviroment variables
//ref: https://www.npmjs.com/package/dotenv
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

// set our port 3000 for dev Env
var port = process.env.PORT || 8899; 

app.use(helmet())


// connect to our mongoDB database 
var db_conn=mongoose.connect(process.env.DB_CONN,{ useMongoClient: true }); 


// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/client'));


// routes ==================================================
require('./app/routes')(app); // load our routes and pass in our app and fully configured passport
require('./app/db-routes')(app); 

// start app ===============================================
// startup our app at http://localhost:8080
server.listen(port, function(){
  console.log(process.env.NODE_ENV);
  console.log('Server listening at ' + port);
  
  //var FacebookService    = require('./services/facebook');
  //SETUP FACEBOOK    
  //    FacebookService.setupGreetingText();   
  //    FacebookService.setupGetStartedButton();
  //    FacebookService.setupPersistentMenu();
  //    FacebookService.setupPersona();
});


//Load all required services/functions
var DialogFlow = require('./services/dialogflow');
var OpenAi = require('./services/openai');
var db_func = require('./services/general');
 
  
io.on('connection', function (socket) {
    
    //create session id for connected user
    const sessionId = uuid.v4();
    
    //Update db table 
    db_func.db_initialize_session(sessionId,socket.id)
     
    //console.log('a user connected',socket.id);
    
    
    
    socket.on('fromClient', function (data) {
            //console.log(data.client);
            const promise = DialogFlow.getRes(data.client,sessionId);
            db_func.db_log_message(sessionId,'sent',data.client);
            
            promise.then(
                  function(result) { /* handle a successful result */ 
                    //console.log('response', result[0].queryResult.intent);
                    socket.emit('fromServer', { server: result[0].queryResult.fulfillmentText });
                    db_func.db_log_message(sessionId,'recieved',result[0].queryResult.fulfillmentText);
                  },
                  function(error) { /* handle an error */ 
                      console.log('Error occurred!', error);
                  }
            );
            
    });
    
    
    socket.on('disconnect', function (reason) {
        //console.log('a user disconnected',socket.id);
        db_func.db_end_session(sessionId);
    });
});

// expose app           
exports = module.exports = app;                         

