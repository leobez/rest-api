const CustomError = require('../utils/CustomError')

const RickAndMortyService = require('./RickAndMortyService')
const FavoriteModel = require('../models/FavoriteModel')

class CharacterService {

    static async addToFavorite(characterId, userId) {
        try {

            // Validate that character exists
            const character = await RickAndMortyService.getCharacterById(characterId)
            if (character.error === 'Character not found') throw new CustomError(404, "Resource not found", ['Invalid id for character'])
            
            // Validate that inst a duplicate
            const favorites = await FavoriteModel.read({by: 'userId', all: true, data: userId})
            for (let a=0; a<favorites.length; a++) {
                if (Number(favorites[a].characterId) === Number(characterId)) {
                    throw new CustomError(409, "Conflict", ['User has already added this character to favorites'])
                }
            }

            // Validate that user doesnt have 3 favorites already
            if (favorites.length >= 3) throw new CustomError(403, "Forbidden", ['User already has 3 characters on favorites'])
        
            // Create favorite on database
            const favorite = await FavoriteModel.create({userId: userId, characterId: characterId, characterName: character.name})
            return favorite

        } catch (error) {
            if (error.type === 'model') {
                // This means an error ocurred while accesssing the database, which is not something the client needs to know
                // At this point it is possible to implement a way to save the error message in a log file so we can debug it later
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error;
        }
    }

    static async getFavoriteList(userId) {
        try {

            const favorites = await FavoriteModel.read({by: 'userId', all: true, data: userId})
            return favorites

        } catch (error) {
            if (error.type === 'model') {
                // This means an error ocurred while accesssing the database, which is not something the client needs to know
                // At this point it is possible to implement a way to save the error message in a log file so we can debug it later
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error;
        }
    }

}

module.exports = CharacterService