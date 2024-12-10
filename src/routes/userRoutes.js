const express = require('express')
const router = express.Router()

// Controller
const UserController = require('../controllers/UserController')

// Express-validator: validate and parse data thats sent by client (params, body, query etc)
const { body, cookie } = require('express-validator')

// Middlewares
const dataValidator = require('../middlewares/dataValidator') // Extracts the result of the validation and determines if there are errors or not
const tokenValidator = require('../middlewares/tokenValidator') // Validates if user has token or not

router.post(
    '/register',
    body('username').exists().withMessage('Missing username').trim().notEmpty().withMessage('Empty username').escape(),
    body('password').exists().withMessage('Missing password').trim().notEmpty().withMessage('Empty password').escape(),
    dataValidator, 
    UserController.register
)

router.post(
    '/login',
    body('username').exists().withMessage('Missing username').trim().notEmpty().withMessage('Empty username').escape(),
    body('password').exists().withMessage('Missing password').trim().notEmpty().withMessage('Empty password').escape(),
    dataValidator,
    UserController.login
)

router.post(
    '/logout',
    cookie('jwt').exists().withMessage('Missing JWT on cookies').trim().notEmpty().withMessage('Empty JWT on cookies').escape(),
    dataValidator,
    tokenValidator,
    UserController.logout
)

router.get(
    '/profile',
    cookie('jwt').exists().withMessage('Missing JWT on cookies').trim().notEmpty().withMessage('Empty JWT on cookies').escape(),
    dataValidator,
    tokenValidator,
    UserController.profile
)


module.exports = router