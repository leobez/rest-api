// Services (business logic)
const UserServices = require('../services/UserService')

class UserController {

    static async register(req, res) {

        try {

            // Get data
            const userData = req.body
            
            // Create user && generate token to auto-login them
            const {user, token} = await UserServices.createUser(userData)

            const userInfo = {
                userId: user.userId,
                username: user.username
            }

            // Send back to client
            return res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            }).status(201).json({
                message: 'User created',
                data: userInfo
            })

        } catch (error) {

            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })

        }
    }

    static async login(req, res) {

        try {

            // Get data
            const userData = req.body
            
            // Create user && generate token to auto-login them
            const {user, token} = await UserServices.loginUser(userData)

            const userInfo = {
                userId: user.userId,
                username: user.username
            }

            // Send back to client
            return res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            }).status(201).json({
                message: 'User logged',
                data: userInfo
            })

        } catch (error) {

            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })

        }
    }

    static async logout(req, res) {

        res.cookie('jwt', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 0,
        }).status(200).json({
            message: 'User logged out', 
            details: ['Session token got removed from cookies']
        })
        
    }
    
}

module.exports = UserController