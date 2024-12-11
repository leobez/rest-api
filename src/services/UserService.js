const UserModel = require('../models/UserModel')

const CustomError = require('../utils/CustomError')

// For password salting and hashing
const bcrypt = require('bcrypt')
const saltRounds = 12

// For session management
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_KEY

class UserService {

    static async createUser(userData) {
        try {
            // Verify if username is already being used
            const isUsernameAlreadyUsed = await UserModel.read({by: 'username', data: userData.username})
            if (isUsernameAlreadyUsed) throw new CustomError(400, 'Bad request', ['Username already used'])

            // Hash && salt password
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(userData.password, salt)

            const newUserData = {
                username: userData.username,
                password: hash
            }

            const user = await UserModel.create(newUserData)

            // Generate session token
            const token = jwt.sign(user, SECRET, {expiresIn: '1h'})

            return {
                user: user,
                token: token
            };

        } catch (error) {
            console.log('error: ', error)
            if (error.type === 'model') {
                // This means an error ocurred while accesssing the database, which is not something the client needs to know
                // At this point it is possible to implement a way to save the error message in a log file so we can debug it later
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }

    static async loginUser(userData) {

        try {

            // Verify if username exists
            const user = await UserModel.read({by: 'username', data: userData.username})
            if (!user) throw new CustomError(400, 'Bad request', ['Username does not exist'])
            
            // validate password
            const isPasswordCorrect = bcrypt.compareSync(userData.password, user.password)
            if (!isPasswordCorrect) throw new CustomError(400, 'Bad request', ['Wrong password'])

            // Generate session token
            const token = jwt.sign(user, SECRET, {expiresIn: '1h'})
            
            return {
                user: user,
                token: token,
            }

        } catch (error) {
            if (error.type === 'model') {
                // This means an error ocurred while accesssing the database, which is not something the client needs to know
                // At this point it is possible to implement a way to save the error message in a log file so we can debug it later
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }
    }

}

module.exports = UserService