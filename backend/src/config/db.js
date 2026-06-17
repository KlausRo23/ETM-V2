import mongoose from "mongoose"

const ConnDB = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB")
    } catch (error) {
        console.error("Failed to connect  to DB", error)
        process.exit(1)
    }
}

export default ConnDB