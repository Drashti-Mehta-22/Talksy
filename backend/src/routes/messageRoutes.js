import express from 'express'
import { sendMessage, getMessages } from '../controllers/messageController.js'
import { protectRoute } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post('/send/:receiverId', protectRoute, upload.single('image'), sendMessage)
router.get('/:receiverId', protectRoute, getMessages)

export default router