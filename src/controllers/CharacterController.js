// Services
const CharacterService = require('../services/CharacterService')
const RickAndMortyService = require('../services/RickAndMortyService')

class CharacterController {

    static async listAllCharacters(req, res) {

        try {

            const {page} = req.query
            const data = await RickAndMortyService.getAllCharacters(page)

            return res.status(200).json({
                rateLimit: req.rateLimit,
                message: 'Resource retrieved',
                data: data.results
            })

        } catch (error) {

            return res.status(error.status).json({
                rateLimit: req.rateLimit,
                message: error.message,
                details: error.details
            })

        }

    }

    static async addToFavorite(req, res) {

        try {

            const {id} = req.params
            const userData = req.user

            const favorite = await CharacterService.addToFavorite(id, userData.userId)

            return res.status(201).json({
                rateLimit: req.rateLimit,
                message: 'Resource created',
                data: favorite
            })

        } catch (error) {
            return res.status(error.status).json({
                rateLimit: req.rateLimit,
                message: error.message,
                details: error.details
            })
        }
    }

    static async listFavorites(req, res) {
        try {

            const userData = req.user
            const favorites = await CharacterService.getFavoriteList(userData.userId)

            return res.status(200).json({
                rateLimit: req.rateLimit,
                message: 'Resource retrieved',
                data: favorites
            })

        } catch (error) {
            return res.status(error.status).json({
                rateLimit: req.rateLimit,
                message: error.message,
                details: error.details
            })
        }
    }

    static async updateFavorite(req, res) {
        try {

            const userData = req.user
            const {id:oldCharacterId} = req.params
            const {newId:newCharacterId} = req.body

            const updatedFavorite = await CharacterService.updateFavorite(userData.userId, oldCharacterId, newCharacterId)

            return res.status(200).json({
                rateLimit: req.rateLimit,
                message: 'Resource updated',
                data: updatedFavorite
            })

        } catch (error) {
            return res.status(error.status).json({
                rateLimit: req.rateLimit,
                message: error.message,
                details: error.details
            })
        }
    }

    static async deleteFavorite(req, res) {
        try {
            
            const userData = req.user
            const {id:characterId} = req.params

            const deletedFavorite = await CharacterService.removeFavorite(userData.userId, characterId)
            
            return res.status(200).json({
                rateLimit: req.rateLimit,
                message: 'Resource deleted',
                data: deletedFavorite
            })

        } catch (error) {
            return res.status(error.status).json({
                rateLimit: req.rateLimit,
                message: error.message,
                details: error.details
            })
        }
    }

    static async listEpsFavoriteAppears(req, res) {

        try {

            const userData = req.user

            const data = await CharacterService.listEpsFavoriteAppears(userData.userId)
            
            return res.status(200).json({
                rateLimit: req.rateLimit,
                message: 'Resource retrieved',
                data: data
            }) 

        } catch (error) {
            console.log('ERROR: ', error)
            return res.status(error.status).json({
                rateLimit: req.rateLimit,
                message: error.message,
                details: error.details
            })
        }
    }

    static async listEpsAllFavoritesAppears(req, res) {

        try {

            const userData = req.user

            const data = await CharacterService.listEpsAllFavoritesAppears(userData.userId)
            
            return res.status(200).json({
                rateLimit: req.rateLimit,
                message: 'Resource retrieved',
                data: {
                    amountOfEps: data.length
                }
            }) 

        } catch (error) {
            console.log('ERROR: ', error)
            return res.status(error.status).json({
                rateLimit: req.rateLimit,
                message: error.message,
                details: error.details
            })
        }
    }

}

module.exports = CharacterController