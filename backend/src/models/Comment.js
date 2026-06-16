import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    author: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thought',
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, {timestamps: true})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment;