const express = require('express')

const cors = require('cors')
const path = require('path')
const morgan = require('morgan')

//fyp routers

const userRouter = require('./routes/users/user.router')
const passwordRouter = require('./routes/forgetPassword/forget.password.router')
const chatRouter = require('./routes/chats/chats.router')
const adminRouter = require('./routes/admin/admin.router')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(cors())
app.use(morgan('dev'))

app.use('/users', userRouter)
app.use('/admin', adminRouter)
app.use(passwordRouter)
app.use('/chats', chatRouter)

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
// })

module.exports = app

