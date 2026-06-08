import { Server} from 'socket.io'
// This map stores userId → socketId

const userSocketMap = {}

export const setupSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // frontend url
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)

    // JOIN
    // When user logs in, they send their userId
    socket.on('join', (userId) => {
      userSocketMap[userId] = socket.id
      console.log(`User ${userId} joined with socket ${socket.id}`)
    })

    // SEND MESSAGE
    // When sender sends a message server finds receiver's socket id and emit to them
    socket.on('sendMessage', (data) => {
      const { receiverId, message } = data

      // Find receiver's socket id from our map
      const receiverSocketId = userSocketMap[receiverId]

      if (receiverSocketId) {
        // Send message only to receiver
        io.to(receiverSocketId).emit('receiveMessage', message)
      }
    })

    // TYPING
    socket.on('typing', (data) => {
      const { receiverId } = data
      const receiverSocketId = userSocketMap[receiverId]

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing')
      }
    })

    // STOP TYPING 
    socket.on('stopTyping', (data) => {
      const { receiverId } = data
      const receiverSocketId = userSocketMap[receiverId]

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stopTyping')
      }
    })

    // DISCONNECT
    // When user closes the tab or loses connection - Remove them from map
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id)

      // Find and remove user from map
      for (const userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId]
          break
        }
      }
    })

  })

  return io
}