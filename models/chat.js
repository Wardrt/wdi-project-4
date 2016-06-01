var mongoose = require("mongoose");

var chatSchema = mongoose.Schema({
  sender: { type: string, unique: true },
  receiver: { type: string, unique: true }
});

module.exports = mongoose.model("Chat", chatSchema);
