var ChatSession = require('./models/ChatSession.js');
var ChatMessage = require('./models/ChatMessage.js');

module.exports = function(app) 
{     
     //================ChatSession api=====================================================================================   
        app.post('/api/chatsession', function(req, res, next) {
          ChatSession.create(req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* GET /chatsession */
        app.get('/api/chatsession', function(req, res, next) {
          ChatSession.find(function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* GET /chatsession/id */
        app.get('/api/chatsession/:id', function(req, res, next) {
          ChatSession.findOne({'session_id': req.params.id}, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* PUT /chatsession/:id */
        app.put('/api/chatsession/:id', function(req, res, next) {
          ChatSession.findOneAndUpdate({'session_id':req.params.id}, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* DELETE /agent/:id 
        app.delete('/api/chatsession/:id', function(req, res, next) {
          ChatSession.findByIdAndRemove(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });   
        */
        
        
         //================ChatMessage api=====================================================================================   
        app.post('/api/chatmessage', function(req, res, next) {
          ChatMessage.create(req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* GET /chatsession */
        app.get('/api/chatmessage', function(req, res, next) {
          ChatMessage.find(function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
};