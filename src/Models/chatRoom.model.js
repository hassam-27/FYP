const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    usersIds: [mongoose.Schema.Types.ObjectId],
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports =  mongoose.model('ChatRoom', chatRoomSchema);
  