class WebSockets {
    users = [];
    connection(client) {
      // event fired when the chat room is disconnected
      client.on("connection", (socket) => {
        console.log('connected..')
        console.log(socket.id + " has joined")

        socket.on('/test', (msg) => {
          console.log(msg);
        })
      });   
    }
  }
  
  module.exports = new WebSockets();