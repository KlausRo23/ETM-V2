import exress from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'

import ConnDB from './config/db.js'
import { globalLimit } from './middleware/ratelimit.js'
import authRoute from './routes/authRoutes.js'



dotenv.config

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())

app.use(globalLimit)

app.use("/api/auth", authRoute)
app.use("/api/thought")
app.use("/api/comment")


ConnDB().then(app.listen(PORT, () => {
    console.log("Connected to Port: ", PORT)
}))