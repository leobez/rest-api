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

}

module.exports = CharacterController