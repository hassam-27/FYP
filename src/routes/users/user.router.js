const express = require('express')
const {checkJwt, checkRole} = require('../../middleware/auth')

const {httpLogin, httpRegister, httpGetProfile, httpUpdateProfile} = require('./user.controller')

const userRouter = express.Router()

userRouter.post('/login', httpLogin)
userRouter.post('/register', httpRegister)
userRouter.get('/profile', checkJwt, checkRole('User'), httpGetProfile)
userRouter.put('/update', checkJwt, checkRole('User'), httpUpdateProfile)

module.exports = userRouter