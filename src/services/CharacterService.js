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
            const duplicate = await FavoriteModel.read({by: 'userId', all: true, data: userId})
            if (duplicate.length >= 1) throw new CustomError(409, "Conflict", ['User has already added this character to favorites'])

            // Create favorite on database
            const favorite = await FavoriteModel.create({userId: userId, characterId: characterId, characterName: character.name})
            return favorite

        } catch (error) {
            console.log('ERROR: ', error)
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