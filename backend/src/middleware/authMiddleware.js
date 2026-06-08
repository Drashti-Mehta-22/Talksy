import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
  try {
    // Get token from request headers
    const token = req.headers.authorization?.split(' ')[1]

    // If no token found
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user from token and attach to request excluding password
    req.user = await User.findById(decoded.userId).select('-password')

    next()

  } catch (error) {
    console.log('Auth middleware error:', error.message)
    res.status(401).json({ message: 'Not authorized, invalid token' })
  }
}