import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from  'cors'
import cookieparser from 'cookie-parser'

import ConnDB from './config/db.js'
import { globalLimit } from './middleware/ratelimit.js'
import authRoute from './routes/authRoutes.js'
import thoughtRoute from './routes/thoughtRoute.js'
import commentRoute from './routes/commentRoutes.js'
import adminRoute from './routes/adminRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

app.use(cookieparser())

app.use(globalLimit)

app.use("/api/auth", authRoute)
app.use("/api/thought", thoughtRoute)
app.use("/api/comment", commentRoute)
app.use("/api/admin", adminRoute)

ConnDB().then(app.listen(PORT, () => {
    console.log("Connected to Port: ", PORT)
}))