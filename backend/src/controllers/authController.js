import User from '../models/User.js'
import bcrypt from 'bcryptjs'

import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email) {
    if (!email || typeof email !== 'string')
        return false

    const trimmed = email.trim().toLowerCase()
    return EMAIL_REGEX.test(trimmed) && trimmed.length <= 100
}

function validatePassword(password) {
    if (!password || typeof password !== 'string')
        return false

    return password.length >= 8 && password.length <= 100
}

function sanitizeInput(input) {
    if (typeof input !== 'string')
        return ''
    return input.trim().slice(0, 1000)
}

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body

        // ✅ Check for missing fields before using them
        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const sanitizeEmail = email.trim().toLowerCase()
        const sanitizeUsername = sanitizeInput(username)

        // ✅ Validate after sanitizing, not before
        if (!validateEmail(sanitizeEmail)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: "Invalid Password" })
        }

        if (sanitizeUsername.length <= 1 || sanitizeUsername.length >= 30) {
            return res.status(400).json({ message: "Invalid Username" })
        }

        const checkEmail = await User.findOne({ email: sanitizeEmail })
        if (checkEmail) {
            return res.status(400).json({ message: "User already exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username: sanitizeUsername,
            email: sanitizeEmail,
            password: hashPassword,
        })

        return res.status(201).json({
            message: 'successfully created user',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })
    } catch (error) {
        console.error("Failed to create user", error)
        return res.status(500).json({ message: "Internal Error" })
    }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }

        const validEmail = email.trim().toLowerCase()

        if (!validateEmail(validEmail)) {
            return res.status(400).json({message: "Invalid email"})
        }

        const user = await User.findOne({email: validEmail})

        if (!user) {
            return res.status(404).json({message: "Invalid Credentials"})
        }
        const isCorrect = await bcrypt.compare(password, user.password)

        if (!isCorrect) {
            return res.status(401).json({message: "Invalid Credential"})
        }

        if (user.status === "banned") {
            return res.status(403).json({message: "User is ban unable to log in"})
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken; await user.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        })

        return res.status(200).json({
            message: "Successfully logged in",
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })

    } catch (error) {
        console.error("Failed to log in", error)
        res.status(500).json({message: "Internal Error"})
    }
}

export async function logout() {
    try {
        res.clearCookie('refreshToken', {path: '/'})
        return res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.error("Error logging out",error)
        return res.status(500).json({message: "Internal ERROR"})
    }
}
