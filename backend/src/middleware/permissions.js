// middleware/permissions.js

// ✅ Permission defined FIRST
export const Permission = {
    // User actions
    SUBMIT_POST:          "submit_post",
    LIKE_POST:            "like_post",
    UNLIKE_POST:          "unlike_post",
    GET_POST:             "get_post",
    DELETE_OWN_POST:      "delete_own_post",
    DELETE_OWN_COMMENT:   "delete_own_comment",
    EDIT_OWN_COMMENT:     "edit_own_comment",
    EDIT_OWN_POST:        "edit_own_post",
    CREATE_COMMENT:       "create_comment",
    LIKE_COMMENT:         "like_comment",
    UNLIKE_COMMENT:       "unlike_comment",

    // Admin actions
    APPROVE_POST:         "approve_post",
    BAN_USER:             "ban_user",
    RESTRICT_USER:        "restrict_user",
    DELETE_ANY_POST:      "delete_any_post",
    DELETE_ANY_COMMENT:   "delete_any_comment",
    EDIT_EDITABLES:       "edit_editables",
    VIEW_PENDING_POST:   "view_pending_post",
    REJECT_POST:          "reject_post",
    VIEW_ALL_PENDING_POSTS: "view_all_pending_post",

    // SuperAdmin only
    MANAGE_ADMINS:        "manage_admins",
    VIEW_LOGS:            "view_logs",
}

// ✅ USER_PERMISSIONS defined AFTER Permission
const USER_PERMISSIONS = [
    Permission.SUBMIT_POST,
    Permission.LIKE_POST,
    Permission.UNLIKE_POST,
    Permission.GET_POST,
    Permission.DELETE_OWN_POST,
    Permission.DELETE_OWN_COMMENT,
    Permission.EDIT_OWN_COMMENT,
    Permission.EDIT_OWN_POST,
    Permission.CREATE_COMMENT,      // ✅ added
    Permission.LIKE_COMMENT,
    Permission.UNLIKE_COMMENT,
]

export const ROLE_PERMISSIONS = {
    superadmin: [...Object.values(Permission)],

    admin: [
        ...USER_PERMISSIONS,
        Permission.VIEW_PENDING_POST,
        Permission.VIEW_ALL_PENDING_POSTS,
        Permission.APPROVE_POST,
        Permission.REJECT_POST,
        Permission.BAN_USER,
        Permission.RESTRICT_USER,
        Permission.DELETE_ANY_POST,
        Permission.DELETE_ANY_COMMENT,
        Permission.EDIT_EDITABLES,
    ],

    user: USER_PERMISSIONS
}