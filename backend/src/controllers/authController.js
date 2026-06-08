import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// REGISTERATION
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle profile pic upload if provided
    let profilePicUrl = ''
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      profilePicUrl = result.secure_url
      fs.unlinkSync(req.file.path)
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic: profilePicUrl,
    })

    // Generate token
    const token = generateToken(newUser._id)

    // Send response
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      }
    })

  } catch (error) {
    console.log('Register error:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user._id)

    // Send response
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      }
    })

  } catch (error) {
    console.log('Login error:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}