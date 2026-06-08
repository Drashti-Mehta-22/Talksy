import express from 'express'
import { getAllUsers, getMyProfile, updateProfile } from '../controllers/userController.js'
import { protectRoute } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// All routes are protected
router.get('/', protectRoute, getAllUsers)
router.get('/profile', protectRoute, getMyProfile)
router.put('/profile', protectRoute,upload.single('profilePic'), updateProfile)

export default router