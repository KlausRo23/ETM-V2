import User from "../models/User.js";
import Thought from '../models/Thought.js'
import Log from "../models/Log.js";
import Comment from "../models/Comment.js";

import { LOGCONSTANTS } from "../config/constants.js"

export async function deleteBadThought(req, res) {
    try {
        const rejectThought = await Thought.findById(req.params.id)

        if (!rejectThought) {
            return res.status(404).json({success: false, message: "Not Found"})
        }
        await Thought.findByIdAndUpdate(
            req.params.id,
            {isApprove: "rejected"})

        await Log.create({
            action: LOGCONSTANTS.actions.thought.REJECT,
            category: LOGCONSTANTS.categories.MODERATION,
            title: "Thought Rejected",
            description: `Admin rejected thought "${rejectThought.title}"`,
            performedBy: req.user._id,
            targetType: LOGCONSTANTS.targetTypes.THOUGHT,
            targetId: rejectThought._id.toString(),    // 👈 missing
            targetName: rejectThought.title            // 👈 missing
        })
        return res.status(200).json({
            success: true,
            message: "Reject Thought"
        })
    } catch (error) {
        console.error("Failed to reject thought", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }


}

export async function deleteBadComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id)

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }

        await Comment.findByIdAndDelete(req.params.id)
        await Thought.findByIdAndUpdate(
            comment.to,
            {$pull: {comments: comment._id}}
        )
        await Log.create({
            action: LOGCONSTANTS.actions.comment.DELETE_ANY,
            category: LOGCONSTANTS.categories.MODERATION,
            title: "Comment Deleted By Admin",
            description: `Admin deleted comment by "${comment.author}"`,
            performedBy: req.user._id,
            targetType: LOGCONSTANTS.targetTypes.COMMENT,
            targetId: comment._id.toString(),
            targetName: comment.content.slice(0, 50)  // first 50 chars as name
        })
        return res.status(200).json({
            success: true,
            message: "Deleted Comment Successfully"
        })
    } catch (error) {
        console.error("Failed to delete comment", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function banUser(req, res) {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        await User.findByIdAndUpdate(
            req.params.id,
            {isBan: "banned"},
            {new: true}
        )

        await Log.create({
            action: LOGCONSTANTS.actions.user.BAN_USER,
            category: LOGCONSTANTS.categories.USER_MANAGEMENT,
            title: "User was banned By Admin",
            description: `Admin banned user "${user.username}"`,
            performedBy: req.user._id,
            targetType: LOGCONSTANTS.targetTypes.USER,
            targetId: user._id.toString(),
            targetName: user.username
        })

        return res.status(200).json({
            success: true,
            message: `You ban user "${user.username}"`
        })
    } catch (error) {
        console.error("Failed to Ban user", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function restrictUser(req, res) {
        try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        await User.findByIdAndUpdate(
            req.params.id,
            {isBan: "restricted"},
            {new: true}
        )

        await Log.create({
            action: LOGCONSTANTS.actions.user.RESTRICT_USER,
            category: LOGCONSTANTS.categories.USER_MANAGEMENT,
            title: "User was banned By Admin",
            description: `Admin restrict user "${user.username}" by "${comment.author}"`,
            "permissions.canPost": false,
            "permissions.canComment": false,
            "permissions.canLike": false,
            performedBy: req.user._id,
            targetType: LOGCONSTANTS.targetTypes.USER,
            targetId: user._id.toString(),
            targetName: user.username 
        })
        

        return res.status(200).json({
            success: true,
            message: `You restrict user "${user.username}"`
        })
    } catch (error) {
        console.error("Failed to restict user", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function approveThought(req, res) {
    try {
        const thought = await Thought.findById(req.params.id)

        if (!thought) {
            return res.status(404).json({
                success: false,
                message: "Cannot found thought"
            })
        }

        await Thought.findByIdAndUpdate(
            req.params.id,
            {isApprove: "approved"},
            {new: true}
        )

        await Log.create({
            action: LOGCONSTANTS.actions.thought.APPROVE,
            category: LOGCONSTANTS.categories.CONTENT,
            title: `"${thought.title}" was approved`,
            description: `Admin approved thought "${thought.title}"`,
            performedBy: req.user._id,
            targetType: LOGCONSTANTS.targetTypes.THOUGHT,
            targetId: thought._id.toString(),
            targetName: thought.title.slice(0, 50)
        })

        return res.status(200).json({
            success: true,
            message: `You approved the post "${thought.title}"`
        })
    } catch (error) {
        console.error("Failed to approve thought", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function rejectThought(req, res) {
   try {
        const thought = await Thought.findById(req.params.id)

        if (!thought) {
            return res.status(404).json({
                success: false,
                message: "thought not found"
            })
        }

        await Thought.findByIdAndUpdate(
            req.params.id,
            {isApprove: "rejected"},
            {new: true}
        )

        await Log.create({
            action: LOGCONSTANTS.actions.thought.REJECT,
            category: LOGCONSTANTS.categories.CONTENT,
            title: `"${thought.title}" was rejected`,
            description: `"${thought.title} was rejected by "${req.user._id}"`,
            performedBy: req.user._id,
            targetType: LOGCONSTANTS.targetTypes.THOUGHT,
            targetId: thought._id.toString(),
            targetName: thought.title.slice(0, 50)
        })

        return res.status(200).json({
            success: true,
            message: `You rejected the post "${thought.title}"`
        })
   } catch (error) {
        console.error("Failed to reject thought", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
   } 
}

export async function getPendingThought(req, res) {
    try {
        const thought = await Thought.findOne({
            _id: req.params.id,
            isApprove: "pending"
        })

        if (!thought) {
            return res.status(404).json({
                success: false,
                message: "Thought not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "fetch successfully",
            date: thought
        })
    } catch (error) {
        console.error("Failed to fetch thought", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function getAllPendingThought(req, res) {
    try {
        const thoughts = await Thought.find({isApprove: "pending"})

        return res.status(200).json({
            success: true,
            message: "Success in fetching pending post",
            data: thoughts
        })
    } catch (error) {
        console.error("Failed to fetch posts", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function getAllRejectedThoughts(req, res) {
    try {
        const thoughts = await Thought.find({isApprove: "rejected"})

        return res.status(200).json({
            success: true,
            message: "Fetched all rejected thoughts",
            data: thoughts
        })
    } catch (error) {
        console.error("Failed to fetch rejected Thoughts", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}