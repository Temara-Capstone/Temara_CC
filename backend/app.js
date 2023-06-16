const express = require('express')
const setupRoutes = require('./routes/routes')
const dotenv = require('dotenv')
const app = express()
const cookieParser = require('cookie-parser')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors')
const bodyParser = require('body-parser')
dotenv.config()


const PORT = 8080

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

setupRoutes(app)
app.use('/', (req,res)=>{
    res.send('Server Running')
})

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    } 
    // console.log(socket.handshake.auth.username)
    socket.username = username;
    next();
  });
  
  
  // bikin map untuk room
  const rooms = []
   // Store available users for pairing
   const availableUsers = []
  
  
  
  io.on('connection', (socket) => {
    console.log('A user connected')
       
      const { username } = socket.handshake.auth;
      console.log(`Connected user: ${username}`);
  
      // Handle further events or actions with the username
  
      // Send a response back to the client
      socket.emit('response', 'Data received successfully!');
  
  
      availableUsers.push({username: username , socketId : socket})
    
      // Check if there are at least two available users for pairing
      if (availableUsers.length >= 2) {
        // Get the first two users from the available users list
        const user1 = availableUsers.shift()
        const user2 = availableUsers.shift()
  
      
        const searchUserAndRoomId = (username) => {
          const foundRoom = rooms.find((room) => room.users.includes(username));
          console.log(foundRoom)
          if (foundRoom) {
            return {
              roomId: foundRoom.id,
              userIndex: username,
              messages: foundRoom.messages
            };
          }
          return false;
        };
        
        // Example usage
        const foundUser = searchUserAndRoomId(username)
        if(foundUser) {
          console.log('User:', foundUser.userIndex)
          console.log('Room ID:', foundUser.roomId)
        } else {
          console.log('User not found.');
        }
          
          // io.to(foundUser.roomId).emit('reconnected', JSON.stringify(foundUser))
        
        
        // Create a unique room ID for the paired users
        const roomId = generateRoomId()
        if(foundUser){
          user1.socketId.join(foundUser.roomId)
          user2.socketId.join(foundUser.roomId)
          user1.socketId.roomId = foundUser.roomId;
          user2.socketId.roomId = foundUser.roomId;
          io.to(foundUser.roomId).emit('reconnected', foundUser)
          socket.roomId = foundUser.roomId
        }else{
          user1.socketId.join(roomId)
          user2.socketId.join(roomId) 
          user1.socketId.roomId = roomId;
          user2.socketId.roomId = roomId;
          const room = {
            id: roomId,
            users:[user1.username, user2.username],
            messages:[]
          }
          rooms.push(room)
          io.to(roomId).emit('paired', roomId);
          console.log(rooms)
          socket.roomId = roomId
        }
  
      }
  
    socket.on('chat message', msg => {
      const room = rooms.find((room) => room.id === socket.roomId);
      console.log(room)
        room.messages.push(msg)
        console.log(rooms)
        socket.to(socket.roomId).emit('chat message', msg)
      })
    
  
    socket.on('disconnect', (msg) => {
      console.log('A user disconnected '+ socket.id);
  
      const index = availableUsers.findIndex((user) => user.socketId === socket.id);
      if (index !== -1) {
        availableUsers.splice(index, 1);
        
      }
      // if(foundUser)
      socket.to(socket.roomId).emit('user left', 'Anonymous left chat');
  
      })
  
      // socket.emit("session", {
      //   sessionID: socket.sessionID, 
      //   userID: socket.userID,
      // });
  })
  
  function generateRoomId() {
    // Generate a random 6-digit room ID
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }


app.listen(PORT, function(){
    console.log(`Server running at port http://localhost:${PORT}`)
})