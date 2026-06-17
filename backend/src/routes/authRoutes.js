import express from 'express'

import { login, logout, refreshToken, registerUser } from '../controllers/authController.js'
import { loginLimit, registerLimit } from '../middleware/ratelimit.js'

const router = express.Router()

router.post('/register', 
    registerLimit, 
    registerUser)

router.post('/login',
    loginLimit, 
    login)

router.post('/refresh', 
    refreshToken)

router.post('/logout', 
    logout)

export default router;