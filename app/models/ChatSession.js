var mongoose = require('mongoose');

var ChatSessionSchema = new mongoose.Schema({
  session_id: { type: String },
  socket_id: { type: String }, 
  project_id: { type: String },
  username: { type: String },
  password : { type: String },
  phone : { type: String },
  authenticated : { type: Number },
  otp : { type: String },
  pin : { type: String },
  session_end : { type: Date },
  comments : { type: String }
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('ChatSession', ChatSessionSchema);
