// middleware/verifyStatus.js

const verifyStatus = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        // 1. Full ban — block everything
        if (req.user.status === "banned") {
            return res.status(403).json({
                success: false,
                message: "Your account has been banned"
            })
        }

        // 2. Restricted — attach permission flags to req
        if (req.user.status === "restricted") {
            req.userPermissions = {
                canPost:    false,
                canComment: false,
                canLike:    false,
            }
        } else {
            // 3. Active — full permissions
            req.userPermissions = {
                canPost:    req.user.permissions?.canPost ?? true,
                canComment: req.user.permissions?.canComment ?? true,
                canLike:    req.user.permissions?.canLike ?? true,
            }
        }

        next()

    } catch (error) {
        console.error("Failed to verify status", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// middleware/verifyStatus.js

export const canPost = (req, res, next) => {
    if (!req.userPermissions?.canPost) {
        return res.status(403).json({
            success: false,
            message: "You are restricted from posting"
        })
    }
    next()
}

export const canComment = (req, res, next) => {
    if (!req.userPermissions?.canComment) {
        return res.status(403).json({
            success: false,
            message: "You are restricted from commenting"
        })
    }
    next()
}

export const canLike = (req, res, next) => {
    if (!req.userPermissions?.canLike) {
        return res.status(403).json({
            success: false,
            message: "You are restricted from liking"
        })
    }
    next()
}

export default verifyStatus