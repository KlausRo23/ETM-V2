import express from "express";
import { deleteComment, editComment, 
    getAllComments, likeComment, 
    postComment, unlikeComment } from "../controllers/commentController.js";
import { commentLimit  } from "../middleware/ratelimit.js";
import { authenticate } from "../middleware/verifyToken.js";
import verifyStatus, { canComment, canPost } from "../middleware/verifyStatus.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { Permission } from "../middleware/permissions.js"

const router = express.Router({mergeParams: true})

router.get("/:thoughtId/comments",
    authenticate,
    verifyStatus,
    getAllComments)

router.post("/create", 
    commentLimit, 
    authenticate,
    verifyStatus,
    canComment,
    checkPermission(Permission.CREATE_COMMENT),
    postComment)

router.put("/:thoughtId/comments/:id", 
    commentLimit, 
    authenticate,
    verifyStatus,
    checkPermission(Permission.EDIT_OWN_COMMENT),
    editComment)
    
router.delete("/:thoughtId/comments/:id", 
    commentLimit, 
    authenticate,
    verifyStatus,
    checkPermission(Permission.DELETE_OWN_COMMENT),
    deleteComment)

router.post('/:id/like', 
    authenticate,
    verifyStatus,
    checkPermission(Permission.LIKE_COMMENT),
    likeComment)

router.delete("/:id/like", 
    authenticate,
    verifyStatus,
    checkPermission(Permission.UNLIKE_COMMENT),
    unlikeComment)

export default router