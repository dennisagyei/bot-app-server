var mongoose = require('mongoose');

var ChatMessageSchema = new mongoose.Schema({
  session_id: { type: String },
  project_id: { type: String },
  message_type: { type: String },  //SENT OR RECIEVED
  message : { type: String },
  comments : { type: String }
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
