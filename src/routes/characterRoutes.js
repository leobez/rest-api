const express = require('express')
const router = express.Router()

// Controller
const CharacterController = require('../controllers/CharacterController')

// Express-validator: validate and parse data thats sent by client
const { param, query, body } = require('express-validator')

// Middlewares
const dataValidator = require('../middlewares/dataValidator') // Extracts the result of the validation and determines if there are errors or not
const tokenValidator = require('../middlewares/tokenValidator') // Validates if user has jwt token or not
const limiter = require('../middlewares/rateLimiter') // Validates if user has jwt token or not


/* UNPROTECTED ROUTES: USER DOESNT NEEDS TO BE LOGGED IN TO ACCESS */
router.get( // Get all characters
    '/',
    query('page').exists().withMessage('Missing page').trim().notEmpty().withMessage('Empty page').isNumeric().withMessage('Invalid page'),
    dataValidator,
    limiter,
    CharacterController.listAllCharacters
)


/* PROTECTED ROUTES: USER NEEDS TO BE LOGGED IN TO ACCESS */

router.post( // Add favorite
    '/favorite/:id',
    param('id').exists().withMessage('Missing id').trim().notEmpty().withMessage('Empty id').isNumeric().withMessage('Invalid id'),
    dataValidator,
    tokenValidator,
    limiter,
    CharacterController.addToFavorite
)   

router.get( // List all favorites
    '/favorite',
    tokenValidator,
    limiter,
    CharacterController.listFavorites
)

router.put( // Update favorite
    '/favorite/:id',
    param('id').exists().withMessage('Missing id').trim().notEmpty().withMessage('Empty id').isNumeric().withMessage('Invalid id'),
    body('newId').exists().withMessage('Missing newId').trim().notEmpty().withMessage('Empty newId').isNumeric().withMessage('Invalid newId'),
    dataValidator,
    tokenValidator,
    limiter,
    CharacterController.updateFavorites
)

router.delete( // Update favorite
    '/favorite/:id',
    param('id').exists().withMessage('Missing id').trim().notEmpty().withMessage('Empty id').isNumeric().withMessage('Invalid id'),
    dataValidator,
    tokenValidator,
    limiter,
    CharacterController.removeFavorite
)

router.get( // Count episodes each favorite character was in
    '/favorite/episode-count-each',
    tokenValidator,
    limiter,
    CharacterController.listEpsFavoriteAppears
)

router.get( // Count episodes all favorite character were in
    '/favorite/episode-count-all',
    tokenValidator,
    limiter,
    CharacterController.listEpsAllFavoritesAppears
)

module.exports = router