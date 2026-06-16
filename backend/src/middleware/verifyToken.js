import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authenticate(req, res, next) {
  try {
    const token = req.cookies.token

    if (!token || token === 'undefined' || token === 'null') {
      console.log('[Auth] Empty or invalid token received')
      return res.status(401).json({
        success: false,
        message: 'Access token is missing or invalid',
      })
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decoded.userInfo._id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    req.user = user
    req.userId = decoded.userInfo._id
    req.username = decoded.userInfo.username
    req.role = decoded.userInfo.role  // ✅ singular, matches schema

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      })
    }

    if (error.name === 'JsonWebTokenError') {
      console.error('[Auth] JWT verification failed:', {
        error: error.message,
        endpoint: req.path,
        method: req.method,
      })
      return res.status(403).json({
        success: false,
        message: 'Invalid token',
      })
    }

    console.error('[Auth] Error in authenticate middleware:', error)
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    })
  }
}