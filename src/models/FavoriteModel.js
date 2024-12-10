const db = require('../db/connection')

class FavoriteModel {

    static create(favorite) {
        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO Favorite (userId, characterId, characterName) VALUES (?, ?, ?)', [favorite.userId, favorite.characterId, favorite.characterName], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM Favorite WHERE favoriteId = ?', lastId, function(err, row) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(row)
                })
            })
        })
    }

    /* 
        by<string>      : determines which query is goind to be used
        all<boolean>    : determines if query is going to return multiple rows ot just one
        data<string>    : determines the data thats used in place of ? in the query 
    */
    static read({by, all, data}) {
        
        let query = ''
        if (by === 'userId') query = 'SELECT * FROM Favorite WHERE userId = ?'
        if (!query) return;

        if (all) {
            return new Promise((resolve, reject) => {
                return db.all(query, [data], function(err, rows) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(rows)
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                return db.get(query, [data], function(err, row) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(row)
                })
            })
        }
    }

    static update() {
        /* ... */
    }

    static delete() {
        /* ... */
    }

}

module.exports = FavoriteModel