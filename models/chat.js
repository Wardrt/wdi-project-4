var mongoose = require("mongoose");

var chatSchema = mongoose.Schema({
  stream: {
    sender: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
    receiver: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
    socketId: { type: string, required: true }
  }
});

module.exports = mongoose.model("Chat", chatSchema);
