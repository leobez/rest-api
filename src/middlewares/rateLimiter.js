const rateLimit = require('express-rate-limit').rateLimit
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_KEY

const limiter = rateLimit({

    windowMs: 60 * 60 * 1000, // 1 hour

    limit: (req, res) => {
        try {
            const token = req.cookies.jwt
            jwt.verify(token, SECRET)
            return 10
        } catch (error) {
            return 3
        }
    },

    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests',
            details: ['Try again later']
        });
    },

})

module.exports = limiter