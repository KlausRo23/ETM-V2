import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format'
      }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ["active", "banned", "restricted"],
        default: "active"
    },
    permissions: {
    canPost:    { type: Boolean, default: true },
    canComment: { type: Boolean, default: true },
    canLike:    { type: Boolean, default: true },
    },
    refreshToken: String
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User;