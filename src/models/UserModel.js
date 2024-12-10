const db = require('../db/connection')

class UserModel {

    static create(user) {
        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [user.username, user.password], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM Users WHERE userId = ?', lastId, function(err, row) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(row)
                })
            })
        })
    }

    static read({by, data}) {

        let query = ''
        if (by === 'username') query = 'SELECT * FROM Users WHERE username = ?'
        if (!query) return;

        return new Promise((resolve, reject) => {
            return db.get(query, [data], function(err, row) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                return resolve(row)
            })
        })
    }

    static update() {
        /* ... */
    }

    static delete() {
        /* ... */
    }

}

module.exports = UserModel