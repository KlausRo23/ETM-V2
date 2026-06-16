import mongoose from "mongoose";

const thoughtSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isApprove: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        
    }],
    approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null      // null until admin approves
    },
    approvedAt: {
        type: Date,
        default: null      // timestamp of approval
    }
}, {timestamps: true})

const Thought = mongoose.model('Thought', thoughtSchema)

export default Thought