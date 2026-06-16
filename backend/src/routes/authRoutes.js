import express from 'express'

import { login, logout, registerUser } from '../controllers/authController.js'
import { loginLimit, registerLimit } from '../middleware/ratelimit.js'

const router = express.Router()

router.post('/register', 
    registerLimit, 
    registerUser)

router.post('/login',
    loginLimit, 
    login)

router.get('/refresh')

router.post('/logout', 
    logout)

export default router;