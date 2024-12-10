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

    static async updateFavorite(userId, favoriteId, newCharacterId) {
        try {

            // Validate that favoriteId exists
            const favorite = await FavoriteModel.read({by: 'favoriteId', all: false, data: favoriteId})
            if (!favorite) throw new CustomError(404, "Resource not found", ['Favorite Id on URL params was not found on database'])
            
            // Validate that favorite belongs to this user
            if (Number(favorite.userId) !== Number(userId)) throw new CustomError(403, "Forbidden", ['Favorite does not belong to this user'])

            // Validate that new characterId exists
            const character = await RickAndMortyService.getCharacterById(newCharacterId)
            if (character.error === 'Character not found') throw new CustomError(404, "Resource not found", ['Invalid id for new favorite'])
        
            // Update
            const updatedFavorite = await FavoriteModel.update(favoriteId, character)
            return updatedFavorite

        } catch (error) {
            if (error.type === 'model') {
                // This means an error ocurred while accesssing the database, which is not something the client needs to know
                // At this point it is possible to implement a way to save the error message in a log file so it can be debugged later
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error;
        }
    }

    static async removeFavorite(userId, favoriteId) {
        try {

            // Validate that favoriteId exists
            const favorite = await FavoriteModel.read({by: 'favoriteId', all: false, data: favoriteId})
            if (!favorite) throw new CustomError(404, "Resource not found", ['Favorite Id on URL params was not found on database'])
            
            // Validate that favorite belongs to this user
            if (Number(favorite.userId) !== Number(userId)) throw new CustomError(403, "Forbidden", ['Favorite does not belong to this user'])

            // Delete
            await FavoriteModel.delete(favoriteId)
            return favorite

        } catch (error) {
            if (error.type === 'model') {
                // This means an error ocurred while accesssing the database, which is not something the client needs to know
                // At this point it is possible to implement a way to save the error message in a log file so it can be debugged later
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error;
        }
    }

    static async listEpsFavoriteAppears(userId) {
        
        try {

            // Get favorite characters from user
            const favorites = await FavoriteModel.read({by: 'userId', all: true, data: userId})
            let favoritesId = favorites.map((favorite) => favorite.characterId)

            // Get qty of eps each favorite character appears
            const favoriteCharactersData = await RickAndMortyService.getCharactersById(favoritesId)

            const amountOfEpsForEach = favoriteCharactersData.map((favCharacterData) => {
                return {
                    characterId: favCharacterData.id,
                    characterName: favCharacterData.name,
                    amountOfEps: favCharacterData.episode.length,
                }
            })

            return amountOfEpsForEach

        } catch (error) {
            if (error.type === 'model') {
                // This means an error ocurred while accesssing the database, which is not something the client needs to know
                // At this point it is possible to implement a way to save the error message in a log file so it can be debugged later
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error;
        }
    }

}

module.exports = CharacterService