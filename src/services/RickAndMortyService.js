const CustomError = require('../utils/CustomError')

const charactersUrl = 'https://rickandmortyapi.com/api/character'

class RickAndMortyService {

    static async getAllCharacters(page) {
        try {
            const result = await fetch(`${charactersUrl}?page=${page}`)
            const data = await result.json()
            return data;
        } catch (error) {
            throw new CustomError(502, "Bad Gateway", ['Failed to retrieve data from third-party api'])
        }
    }

    static async getCharacterById(characterId) {
        try {
            const result = await fetch(`${charactersUrl}/${characterId}`)
            const data = await result.json()
            return data;
        } catch (error) {
            throw new CustomError(502, "Bad Gateway", ['Failed to retrieve data from third-party api'])
        }
    }

    static async getCharactersById(charactersId) {
        try {
            const convertedCharactersId = charactersId.join(',')
            if (convertedCharactersId.trim() === '') return []

            const result = await fetch(`${charactersUrl}/${convertedCharactersId}`)
            const data = await result.json()
            
            return data;

        } catch (error) {
            throw new CustomError(502, "Bad Gateway", ['Failed to retrieve data from third-party api'])
        }
    }

}

module.exports = RickAndMortyService