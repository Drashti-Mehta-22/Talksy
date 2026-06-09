import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB} from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import messageRoutes from './src/routes/messageRoutes.js'
import { setupSocket} from './src/socket/socket.js'
import http from 'http'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Creating HTTP server from express app because Socket.io needs this instead of app.listen directly
const server = http.createServer(app)
setupSocket(server)

// Middlewares
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://talksy-chat-application.vercel.app'
  ],
  credentials: true
}))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Talksy backend is running!' })
})

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB()
})