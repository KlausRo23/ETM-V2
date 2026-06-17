import express from 'express'
import { createThought, deleteThought, 
    editThought, getAllApprovedThoughts, 
    getThought, likeThought, unlikeThought } from '../controllers/thougthsController.js'
import { apiLimit, postLimit } from '../middleware/ratelimit.js'
import { authenticate } from '../middleware/verifyToken.js'
import verifyStatus, { canPost } from '../middleware/verifyStatus.js'
import { checkPermission } from '../middleware/checkPermission.js'
import { Permission } from "../middleware/permissions.js"
import commentRouter from './commentRoutes.js'

const router = express.Router()

router.get("/", 
    authenticate,
    verifyStatus,
    getAllApprovedThoughts)

router.get('/:id', 
    authenticate,
    verifyStatus,
    checkPermission(Permission.GET_POST),
    getThought)

router.post('/create', 
    postLimit, 
    authenticate, 
    verifyStatus,
    canPost,
    checkPermission(Permission.SUBMIT_POST),
    createThought)

router.put('/:id',
    apiLimit,
    authenticate, 
    verifyStatus,
    checkPermission(Permission.EDIT_OWN_POST),
    editThought)

router.delete("/:id",
    apiLimit,
    authenticate, 
    verifyStatus,
    checkPermission(Permission.DELETE_OWN_POST),
    deleteThought)

router.post("/:id/like", 
    authenticate,
    verifyStatus,
    checkPermission(Permission.LIKE_POST),
    likeThought)

router.delete('/:id/like', 
    authenticate, 
    verifyStatus,
    checkPermission(Permission.UNLIKE_POST),
    unlikeThought)

router.use("/:thoughtId/comments", commentRouter) 

export default router