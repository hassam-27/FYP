const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    sender: {type: String, enum: ['User', 'Admin', 'Dermatologist']},
    createdAt: { type: Date, default: Date.now },
    imageUrl: { type: String },
  });
  
  module.exports =  mongoose.model('ChatMessage', chatMessageSchema);
  
  