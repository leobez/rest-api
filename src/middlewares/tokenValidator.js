// For session management
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_KEY

function tokenValidator (req, res, next) {

    try {

        const token = req.cookies.jwt
        const userDecoded = jwt.verify(token, SECRET)
        req.user = userDecoded
        next()

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: 'Forbidden',
                details: ['Token expired']
            })
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Unauthorized',
                details: ['Token invalid']
            })
        }

        // In case this happens, it means something went wrong while verifying token which is not something the client needs to know
        // Here it is possible to implement a way to save the error message in a log file so it can be debbuged 
        return res.status(500).json({
            message: 'Server error',
            details: ['Something went wrong. Try again later']
        })
    }
}

module.exports = tokenValidator