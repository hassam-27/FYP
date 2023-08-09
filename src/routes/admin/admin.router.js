const express = require('express')
const { checkJwt, checkRole } = require('../../middleware/auth')

const { httpLogin,
    httpRegister,
    httpGetProfile,
    httpUpdateProfile,
    httpAddDermatologist,
    httpGetDermatologists,
    httpGetDermatologistById,
    httpUpdateDermatologistById
} = require('./admin.controller')

const {
    httpForgetPasswordAdmin,
    httpCheckToken,
    httpResetPasswordAdmin
} = require('../forgetPassword/forget.password.controller')

const adminRouter = express.Router()

adminRouter.post('/login', httpLogin)
adminRouter.post('/register', httpRegister)
adminRouter.post('/forget-password', httpForgetPasswordAdmin)
adminRouter.post('/otp', httpCheckToken)
adminRouter.post('/reset-password', httpResetPasswordAdmin)
adminRouter.get('/profile', checkJwt, checkRole('Admin'), httpGetProfile)
adminRouter.put('/update', checkJwt, checkRole('Admin'), httpUpdateProfile)
adminRouter.post('/addDermatologist', checkJwt, checkRole('Admin'), httpAddDermatologist)
adminRouter.get('/dermatologists', checkJwt, checkRole('Admin'), httpGetDermatologists)
adminRouter.get('/dermatologists/:id', checkJwt, checkRole('Admin'), httpGetDermatologistById)
adminRouter.put('/dermatologists/:id', checkRole('Admin'), httpUpdateDermatologistById)

// TODO
// adminRouter.get('/users', checkRole('Admin'), httpGetUsers)
// adminRouter.get('/users/:id', checkRole('Admin'), httpGetUserById)


module.exports = adminRouter