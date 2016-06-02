var Chat = require("../models/chat");

function open(req, res){
  Chat.findOne({
    sender: { $exists: true},
    receiver: { $exists: false}
  }, function(err, chat) {
    if (chat === null) {
      var newChat = new Chat(
        {
          sender: req.body.user._id,
          open: true,
          socketId: req.body.socketId
        }
      );
      newChat.save(function(err, createdChat) {
        if (err) return res.status(500).send(err);
        return res.status(200).send(createdChat);
      });
    } else {
      chat.receiver = req.body.user._id;
      chat.open = false;
      chat.save(function(err, savedChat) {
        if (err) return res.status(500).send(err);
        return res.status(200).send(savedChat);
      });
    }
  });
}

function close(req, res){
  // Mark chat as closed
  // When a chat has a sender and receiver, chat is closed.
  // When a sender or receiver leaves the chat is open again.
  // If sender leaves, receiver becomes sender?
  Chat.find({
    open: false
  }, function(err, chat){
    if ((chat.sender === null && chat.receiver !== null) || (chat.receiver === null && chat.sender !== null)) {
      // So after a socket.disconnect do something.
      chat.open = true;
    }
    // If both leave delete the room?
  });
}

module.exports = {
  open: open,
  close: close
};
