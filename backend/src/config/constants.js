// config/constants.js
export const LOGCONSTANTS = {
    actions: {
        thought: {
            CREATE:     "CREATE_THOUGHT",
            APPROVE:    "APPROVE_THOUGHT",
            REJECT:     "REJECT_THOUGHT",
            DELETE:     "DELETE_THOUGHT",
        },
        comment: {
            CREATE:     "CREATE_COMMENT",
            DELETE:     "DELETE_COMMENT",
        },
        auth: {
            LOGIN:      "LOGIN",
            LOGOUT:     "LOGOUT",
            REGISTER:   "REGISTER",
        },
        user: {
            BAN:        "BAN_USER",
            RESTRICT:   "RESTRICT_USER",
        }
    },
    categories: {
        MODERATION:     "MODERATION",
        AUTHENTICATION: "AUTHENTICATION",
        CONTENT:        "CONTENT",
        USER_MANAGEMENT: "USER_MANAGEMENT",
    },
    targetTypes: {
        THOUGHT:    "THOUGHT",
        COMMENT:    "COMMENT",
        USER:       "USER",
    }
}