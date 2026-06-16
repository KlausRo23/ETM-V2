// middleware/rbac.utils.js
import { ROLE_PERMISSIONS } from "../middleware/permissions.js"

// Get user's permissions based on role
export const getUserPermissions = (user) => {
    if (!user || !user.role) return []
    return ROLE_PERMISSIONS[user.role] || []
}

// Check if user has a specific permission
export const hasPermission = (user, permission) => {
    const permissions = getUserPermissions(user)
    return permissions.includes(permission)
}

// Check if user has any of the permissions
export const hasAnyPermission = (user, permissions) => {
    return permissions.some(permission => hasPermission(user, permission))
}

// Check if user is superadmin
export const isSuperAdmin = (user) => {
    return user?.role === "superadmin"
}

// Check if user is admin
export const isAdmin = (user) => {
    return user?.role === "admin"
}