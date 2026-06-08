import express from 'express'
import { getAllUsers, getMyProfile, updateProfile } from '../controllers/userController.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes are protected
router.get('/', protectRoute, getAllUsers)
router.get('/profile', protectRoute, getMyProfile)
router.put('/profile', protectRoute, updateProfile)

export default router