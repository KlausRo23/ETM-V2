// middleware/checkPermission.js
import { hasPermission, isSuperAdmin } from "./rbac.utils.js"
import { LOGCONSTANTS } from "../config/constants.js"
import Log from "../models/Log.js"

// ================================
// CHECK SINGLE PERMISSION
// ================================
export const checkPermission = (permission) => {
    return (req, res, next) => {
        try {
            // Must come after verifyToken
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                })
            }

            if (!hasPermission(req.user, permission)) {
                // Log the denial
                console.warn("[RBAC] Permission denied:", {
                    user: req.user.username,
                    role: req.user.role,
                    permission,
                    endpoint: req.originalUrl,
                    method: req.method,
                    timestamp: new Date().toISOString()
                })

                return res.status(403).json({
                    success: false,
                    message: "Insufficient permissions"
                })
            }

            next()

        } catch (error) {
            console.error("[RBAC] Error checking permission:", error)
            return res.status(500).json({
                success: false,
                message: "Error checking permissions"
            })
        }
    }
}

// ================================
// REQUIRE SUPERADMIN
// ================================
export const requireSuperAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            })
        }

        if (!isSuperAdmin(req.user)) {
            console.warn("[RBAC] SuperAdmin access denied:", {
                user: req.user.username,
                role: req.user.role,
                endpoint: req.originalUrl,
                method: req.method,
                timestamp: new Date().toISOString()
            })

            return res.status(403).json({
                success: false,
                message: "SuperAdmin access required"
            })
        }

        next()

    } catch (error) {
        console.error("[RBAC] Error checking SuperAdmin:", error)
        return res.status(500).json({
            success: false,
            message: "Error checking permissions"
        })
    }
}