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

    static async listEpsAllFavoritesAppears(userId) {
        
        try {

            // Get favorite characters from user
            const favorites = await FavoriteModel.read({by: 'userId', all: true, data: userId})

            // Map the id of favorite characters
            const favoritesId = favorites.map((favorite) => favorite.characterId)

            // Get data about every character
            const favoriteCharactersData = await RickAndMortyService.getCharactersById(favoritesId)

            // Map every episode to the amount of favorite character that appears on that episode
            /* 
                Result will be something like:
                {
                    'https://rickandmortyapi.com/api/episode/1' : 1,
                    'https://rickandmortyapi.com/api/episode/2' : 2,
                    'https://rickandmortyapi.com/api/episode/3' : 2,
                    'https://rickandmortyapi.com/api/episode/4' : 3,
                    ...
                }
            */
            let hashMap = {}
            favoriteCharactersData.forEach((favoriteCharacter) => {
                favoriteCharacter.episode.forEach((episode) => {
                    if (!hashMap[episode]) {
                        hashMap[episode]=1
                    } else {
                        hashMap[episode]++
                    }
                })
            })


            // Now filter only the episodes which every favorite character appeared
            /* 
                Result will be something like:
                [
                    'https://rickandmortyapi.com/api/episode/4',
                    ...
                ]
            */
            const filteredData = Object.entries(hashMap)
                .filter((EP_TO_FAV) => EP_TO_FAV[1] === favorites.length)
                .map((EP_TO_FAV) => EP_TO_FAV[0])

            return filteredData

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