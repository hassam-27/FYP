const express = require('express')
const {checkJwt, checkRole} = require('../../middleware/auth')
const {httpInitiateChat, httpGetAllChats, httpGetChatMessages, } = require('./chats.controller')


const chatRouter = express.Router()

chatRouter.post('/', httpInitiateChat)
chatRouter.get('/:chatRoomId/messages', httpGetChatMessages)
chatRouter.get('/:userId', httpGetAllChats)

module.exports = chatRouter