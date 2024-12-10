// Services
const CharacterService = require('../services/CharacterService')
const RickAndMortyService = require('../services/RickAndMortyService')

class CharacterController {

    static async listAllCharacters(req, res) {

        try {

            const {page} = req.query
            const data = await RickAndMortyService.getAllCharacters(page)

            return res.status(200).json({
                message: 'Resource retrieved',
                data: data.results
            })

        } catch (error) {

            return res.status(error.status).json({
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
                message: 'Resource created',
                data: favorite
            })

        } catch (error) {
            return res.status(error.status).json({
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
                message: 'Resource retrieved',
                data: favorites
            })

        } catch (error) {
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async updateFavorites(req, res) {
        try {

            const userData = req.user
            const {id:favoriteId} = req.params
            const {newId:newCharacterId} = req.body

            const updatedFavorite = await CharacterService.updateFavorite(userData.userId, favoriteId, newCharacterId)

            return res.status(200).json({
                message: 'Resource updated',
                data: updatedFavorite
            })

        } catch (error) {
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async removeFavorite(req, res) {
        try {
            
            const userData = req.user
            const {id:favoriteId} = req.params

            const deletedFavorite = await CharacterService.removeFavorite(userData.userId, favoriteId)
            
            return res.status(200).json({
                message: 'Resource deleted',
                data: deletedFavorite
            })

        } catch (error) {
            return res.status(error.status).json({
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
                message: 'Resource retrieved',
                data: data
            }) 

        } catch (error) {
            console.log('ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

}

module.exports = CharacterController