import Thought from "../models/Thought.js";
import Comment from '../models/Comment.js'


function sanitizeTitle(title) {
    if (typeof title !== 'string') return ''
    return title.trim().slice(0, 100)
}

function sanitizeContent(content) {
    if (typeof content !== 'string')
        return content.trim().slice(0, 5000)
}
//User can only see the approved post
export async function getAllApprovedThoughts(req, res) {
    try {
        const allThougths = await Thought.find({isApprove: "approved"}).populate('author', 'username').sort({created: -1})
        return res.status(200).json(allThougths)
    } catch (error) {
        console.error("Failed to fetch all thoughts", error)
        return res.status(500).json({message: error.message})
    }
}

export async function getThought(req, res) {
    try {
        const thought = await Thought.findById(req.params.id)

        if (!thought) {
            return res.status(404).json({message: "Thought not found"})
        }
        return res.status(200).json(thought)
    } catch (error) {
        console.error("Error in fetching the thought", error)
        return res.status(500).json({message: error.message})
    }
}

export async function createThought(req, res) {
    try {
        const { title, content } = req.body

        if (!title || !content) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const polishTitle = sanitizeTitle(title)
        const polishContent = sanitizeContent(content)

        if (polishTitle.length < 1) {
            return res.status(400).json({message: "Title cannot be empty"})
        }

        if (polishContent > 100 || polishTitle > 5000) {
            return res.status(400).json({message: "Invalid, please shorten the title to 100 characters or content to 5000"})
        }

        const thought = await new Thought({
            author: req.user._Id,
            title: polishTitle,
            content: polishContent
        }).save()

        return res.status(201).json({message: "Created Successfully", thought: {title: thought.title}})
    } catch (error) {
       console.error("Failed in creating title", error)
       return res.status(500).json({message: error.message}) 
    }
}

export async function editThought(req, res) {
    try {
        const thought = await Thought.findById(req.params.id)

        if (!thought) {
            return res.status(404).json({message: "Thought not found"})
        }

        const {title, content} = req.body

        const isOwner = thought.author.toString() === req.user._id.toString()

        if (!isOwner) {
            return res.status(403).json({message: "You can only edit your own post"})
        }

        const polishTitle = sanitizeTitle(title)
        const polishContent = sanitizeContent(content)

        if (!polishTitle || !polishContent) {
            return res.status(400).json({message: "Do not leave it empty"})
        }


        const updatedThought = await Thought.findByIdAndUpdate(req.params.id, {
            title: polishTitle,
            content: polishContent,
            isApprove: "pending",
            approvedBy: null,
            approvedAt: null
        }, {new: true})

        return res.status(200).json({
            success: true,
            message: "Thought updated successfully",
            data: { title: updatedThought.title }
        })
    } catch (error) {
        console.error("Failed to edit note", error)
        return res.status(500).json({message: error.message})
    }
}

export async function deleteThought(req, res) {
    try {
        const thought = await Thought.findById(req.params.id)

        if (!thought) {
            return res.status(404).json({message: "Thought not found"})
        }

        const isOwner = thought.author.toString() === req.user._id.toString()

        if (!isOwner) {
            return res.status(403).json({message: "You can only delete your own Thought"})
        }

        await Comment.deleteMany({ to: req.params.id })
        await Thought.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "Thought successfully deleted"})
    } catch (error) {
        console.error("Failed to delete thought", error)
        return res.status(500).json({message: error.message})
    }
}

export async function likeThought(req, res) {
    try {
        const thought = await Thought.findById(req.params.id)
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: "Thought not found"
            })
        }

        // Check if already liked
        const alreadyLiked = thought.likedBy.some(
            id => id.toString() === req.user._id.toString()
        )

        if (alreadyLiked) {
            return res.status(400).json({
                success: false,
                message: "You already liked this post"
            })
        }

        // Add like
        thought.likedBy.push(req.user._id)
        await thought.save()

        return res.status(200).json({
            success: true,
            message: "Post liked",
            data: { likes: thought.likedBy.length }
        })

    } catch (error) {
        console.error("Failed to like post", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function unlikeThought(req, res) {
    try {
        const thought = await Thought.findById(req.params.id)
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: "Thought not found"
            })
        }

        // Check if actually liked
        const alreadyLiked = thought.likedBy.some(
            id => id.toString() === req.user._id.toString()
        )

        if (!alreadyLiked) {
            return res.status(400).json({
                success: false,
                message: "You haven't liked this post yet"
            })
        }

        // Remove like
        thought.likedBy = thought.likedBy.filter(
            id => id.toString() !== req.user._id.toString()  // ✅ both toString()
        )
        await thought.save()

        return res.status(200).json({
            success: true,
            message: "Post unliked",
            data: { likes: thought.likedBy.length }
        })

    } catch (error) {
        console.error("Failed to unlike post", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}