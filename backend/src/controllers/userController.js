import User from '../models/User.js'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'

export const getAllUsers = async (req, res) => {
  try {
    // Get all users except the logged in user
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password')

    res.status(200).json(users)

  } catch (error) {
    console.log('Get all users error:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET MY PROFILE
export const getMyProfile = async (req, res) => {
  try {
    // req.user is already set by authMiddleware
    res.status(200).json(req.user)

  } catch (error) {
    console.log('Get profile error:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// UPDATE MY PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { username } = req.body

    let updateData = { username }

    // Handle profile pic upload if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      updateData.profilePic = result.secure_url
      fs.unlinkSync(req.file.path)
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password')

    res.status(200).json(updatedUser)

  } catch (error) {
    console.log('Update profile error:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}