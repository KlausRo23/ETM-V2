// models/Log.js
import mongoose from "mongoose"

const logSchema = new mongoose.Schema({

    // What happened
    action: {
        type: String,
        required: true
        // e.g. "APPROVE_THOUGHT", "REJECT_THOUGHT", "BAN_USER"
    },

    // Category for grouping
    category: {
        type: String,
        required: true
        // e.g. "MODERATION", "AUTHENTICATION", "CONTENT"
    },

    // Short title
    title: {
        type: String,
        required: true
    },

    // Full description
    description: {
        type: String,
        required: true
    },

    // Who did it (admin)
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    // What was affected
    targetType: {
        type: String,
        // e.g. "THOUGHT", "USER", "COMMENT"
    },
    targetId: {
        type: String,
    },
    targetName: {
        type: String,
    }

}, { timestamps: true })

// Indexes for faster queries
logSchema.index({ createdAt: -1 })
logSchema.index({ category: 1, createdAt: -1 })
logSchema.index({ action: 1, createdAt: -1 })

const Log = mongoose.model('Log', logSchema)

export default Log