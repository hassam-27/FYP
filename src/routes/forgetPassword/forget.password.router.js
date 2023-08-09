const express = require('express')
const {httpForgetPassword, httpCheckToken, httpResetPassword} = require('./forget.password.controller')

const passwordRouter = express.Router()

passwordRouter.post('/forget-password', httpForgetPassword)
passwordRouter.post('/otp', httpCheckToken)
passwordRouter.post('/reset-password', httpResetPassword)



module.exports = passwordRouter
