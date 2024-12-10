const express = require('express')
const router = express.Router()

// Controller
const CharacterController = require('../controllers/CharacterController')

// Express-validator: validate and parse data thats sent by client (params, body, query etc)
const { param } = require('express-validator')

// Middlewares
const dataValidator = require('../middlewares/dataValidator') // Extracts the result of the validation and determines if there are errors or not
const tokenValidator = require('../middlewares/tokenValidator') // Validates if user has token or not


router.get(
    '/favorite',
    tokenValidator,
    CharacterController.listFavorites
)

router.post(
    '/favorite/:id',
    param('id').exists().withMessage('Missing id').trim().notEmpty().withMessage('Empty id').isNumeric().withMessage('Invalid id'),
    dataValidator,
    tokenValidator,
    CharacterController.addFavorite
)   

router.put(
    '/favorite/:id',
    param('id').exists().withMessage('Missing id').trim().notEmpty().withMessage('Empty id').isNumeric().withMessage('Invalid id'),
    dataValidator,
    tokenValidator,
)

router.delete(
    '/favorite/:id',
    param('id').exists().withMessage('Missing id').trim().notEmpty().withMessage('Empty id').isNumeric().withMessage('Invalid id'),
    dataValidator,
    tokenValidator,
)

router.get(
    '/favorite/episode-count-fav',
    tokenValidator
)

router.get(
    '/favorite/episode-count-all',
    tokenValidator
)

module.exports = router