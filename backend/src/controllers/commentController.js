import Comment from "../models/Comment.js";
import Thought from "../models/Thought.js";

function sanitizeInput(input) {
    if (typeof input !== 'string') return ''
    return input.trim().slice(0, 500)
}

export async function getAllComments(req, res) {
    try {
        const comments = await Comment.find({to: req.params.thoughtId }).populate('author', 'username').sort({createdAt: -1})
        
        return res.status(200).json(comments)
    } catch (error) {
        console.error("Failed to fetch all comments", error)
        return res.status(500).json({message: error.message})
    }
}

export async function postComment(req, res) {
    try {
        const { content, thoughtId } = req.body

        // 1. Validate
        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty"
            })
        }

        if (!thoughtId) {
            return res.status(400).json({
                success: false,
                message: "thoughtId is required"
            })
        }

        // 2. Sanitize
        const validComment = sanitizeInput(content)

        if (validComment.length < 1) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty"
            })
        }

        // 3. Check if thought exists
        const thought = await Thought.findById(thoughtId)
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: "Thought not found"
            })
        }

        // 4. Create comment
        const comment = await Comment.create({
            content: validComment,
            author: req.user._id,
            to: thoughtId
        })

        // 5. Push to thought's comments array
        await Thought.findByIdAndUpdate(
            thoughtId,
            { $push: { comments: comment._id } }
        )

        // 6. Return populated comment
        const populated = await comment.populate('author', 'username')

        return res.status(201).json({
            success: true,
            message: "Comment posted successfully",
            data: populated
        })

    } catch (error) {
        console.error("Failed to create comment", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function editComment(req, res) {
    try {
        const {content} = req.body

        if (!content) {
            return res.status(400).json({message: "Do not leave it empty"})
        }

        const comment = await Comment.findById(req.params.id)

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty"
            })
        }

        const isOwner = comment.author.toString() === req.user._id.toString()

        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message: "Edit your own comment"
            })
        }

        const validComment = sanitizeInput(content)

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id, {content: validComment}, {new: true}).populate('author', 'username')

        return res.status(200).json({
            success: true,
            message: "Updated successfully",
            data: updatedComment
        })
    } catch (error) {
        console.error("Failed to edit comment", error)
        return res.status(500).json({
        success: false,
        message: error.message
    })
    }
}

export async function deleteComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id)

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" })
        }

        const isOwner = comment.author.toString() === req.user._id.toString()
        const isAdmin = req.user.role === "admin" || req.user.role === "superadmin"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "You can only delete your own comment" })
        }

        await Comment.findByIdAndDelete(req.params.id)
        await Thought.findByIdAndUpdate(
            comment.to,
            { $pull: { comments: comment._id } }
        )

        return res.status(200).json({ success: true, message: "Successfully deleted a comment" })
    } catch (error) {
        console.error("Failed to delete comment", error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export async function likeComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id)

        if (!comment) {
            return res.status(404).json({success: false, message: "Cannot find comment"})
        }

        const alreadyLiked = comment.likedBy.some(
            id => id.toString() === req.user._id.toString()
        )

        if (alreadyLiked) {
            return res.status(400).json({
                success: false,
                message: "You already liked this comment"
            })
        }

        comment.likedBy.push(req.user._id)
        await comment.save()

        return res.status(200).json({
            success: true,
            message: "Liked Post",
            data: { likes: comment.likedBy.length }
        })
    } catch (error) {
        console.error("Failed to like post", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function unlikeComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id)

        if (!comment) {
            return res.status(404).json({success: false, message: "Comment not found"})
        }

        const alreadyLiked = comment.likedBy.some(
            id => id.toString() === req.user._id.toString()
        )

        if (!alreadyLiked) {
            return res.status(400).json({success: false, message: "You haven't like the comment"})
        }

        comment.likedBy = comment.likedBy.filter(
            id => id.toString() !== req.user._id.toString()  // ✅ both toString()
        )
        await comment.save()

        return res.status(200).json({
            success: true,
            message: "Comment unliked",
            data: { likes: comment.likedBy.length }
        })
    } catch (error) {
        console.error("Failed to unlike post", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}