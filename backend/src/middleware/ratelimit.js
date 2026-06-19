import ratelimit from 'express-rate-limit'

export const globalLimit = ratelimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: "Slow down you are making many request at a short time",
    standardHeaders: true,
    legacyHeaders: false,
})

export const loginLimit = ratelimit({
    windowMs: 5 * 60 * 1000,
    max: 500,
    message: "You reached a thereshold in logging in",
    standardHeaders: true,
    legacyHeaders: false,
})

export const registerLimit = ratelimit({
    windowMs: 3 * 60 * 1000,
    max: 10,
    message: "You reached a thereshold in making new accounts",
    standardHeaders: true,
    legacyHeaders: false,
})

export const postLimit = ratelimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "You're posting so much content",
    standardHeaders: true,
    legacyHeaders: false,
})

export const commentLimit = ratelimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "You reached a thereshold",
    standardHeaders: true,
    legacyHeaders: false,
})

export const apiLimit = ratelimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "You're posting so much content",
    standardHeaders: true,
    legacyHeaders: false,
})