import express from "express";
import { approveThought, banUser, 
    deleteBadComment, 
    deleteBadThought,
     getAllPendingThought, 
    getAllRejectedThoughts, 
    getPendingThought, 
    rejectThought, 
    restrictUser} from "../controllers/adminController.js";
import { authenticate } from "../middleware/verifyToken.js";
import verifyStatus from "../middleware/verifyStatus.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { Permission } from "../middleware/permissions.js";
import authorize from "../middleware/verifyRoles.js";

const router = express.Router()

router.get("/pendings", 
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.VIEW_ALL_PENDING_POSTS),
    getAllPendingThought
)

router.get("/rejected", 
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.REJECT_POST),
    getAllRejectedThoughts
)

router.get("/:id", 
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.VIEW_PENDING_POST),
    getPendingThought
)

router.delete("/thought/:id",
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.DELETE_ANY_POST),
    deleteBadThought
)

router.delete("/comment/:id",
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.DELETE_ANY_COMMENT),
    deleteBadComment
)

router.patch("/ban/:id",
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.BAN_USER),
    banUser
)

router.patch("/restrict/:id",
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.RESTRICT_USER),
    restrictUser
)

router.patch("/approve/:id",
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.APPROVE_POST),
    approveThought
)

router.patch("/reject/:id",
    authenticate,
    verifyStatus,
    authorize("admin"),
    checkPermission(Permission.REJECT_POST),
    rejectThought
)
export default router