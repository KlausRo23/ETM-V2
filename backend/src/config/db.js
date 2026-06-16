import mongoose from 'mongoose'

const ConnDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("Failed to connect to MongoDB", error)
        process.exit(1)
    }
}

export default ConnDB