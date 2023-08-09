const http = require('http')

require('dotenv').config()

const app = require('./app')
const WebSockets = require('./services/sockets')
const { mongoConnect } = require('./services/mongo');


const PORT = 8000


let clients = {}
const server = http.createServer(app)
let io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log('connected')
    console.log(socket.id + ' has joined')
    socket.on('/signin', (id) => {
        
        clients[id] = socket;
    })
    socket.on('message', (msg) => {
        console.log(msg)
        if (msg['sender'] === 'Admin')
        {
            msg['sender'] = 'User'
        }
        else if (msg['sender'] === 'User') {
            msg['sender'] = 'Admin';
        }
        let targetId = msg.target // use target id when integration and remove else block
        if (clients[targetId]){
            clients[targetId].emit("message", msg)
        }
        clients['6432b4261741bea8703d7911'].emit("message", msg) // sending message to itself
    })
})
















// MONGO_URL=mongodb+srv://hsm35:hassamAreebaFYP1335@dermaaid.ihevzry.mongodb.net/?retryWrites=true&w=majority



async function startServer()
{
    await mongoConnect()
    server.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
}

startServer()
