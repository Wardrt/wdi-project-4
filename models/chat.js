var mongoose = require("mongoose");

var chatSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.ObjectId, ref: 'User' },
  socketId: { type: String, required: true },
  open: { type: Boolean, required: true}
});

module.exports = mongoose.model("Chat", chatSchema);
