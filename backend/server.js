import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB} from './src/config/db.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(express.json())
app.use(cors())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Talksy backend is running!' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB()
})