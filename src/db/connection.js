const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const DB_PATH = path.join(__dirname, 'database.sqlite3')

// Delete existing DB file (if exists)
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
    console.log('Old DB deleted')
}

// Create new DB connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error while connecting to database', err.message)
    } else {
        console.log('Connected to SQLITE3 database')
    }
})


// Default password for testing (TO REMOVE)
const salt = bcrypt.genSaltSync(12)
const hash = bcrypt.hashSync('pass1', salt)

// Run commands in order
db.serialize(() => {

    // Create table 'Users'
    db.run(`
        CREATE TABLE Users(
            userId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Users" table', err.message)
        } else {
            console.log('Table Users created')
        }
    }),

    // Create table 'Favorite'
    db.run(`
        CREATE TABLE Favorite(
            favoriteId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            userId INTEGER NOT NULL,
            characterId INTEGER NOT NULL,
            characterName VARCHAR(255) NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users (userId)
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Favorite" table', err.message)
        } else {
            console.log('Table Favorite created')
        }
    }),

    // Insert some data just for testing (Users)
    // username: user1
    // password: pass1
    db.run(`
        
        INSERT INTO Users(username, password) VALUES (?, ?)

    `, ['user1', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added on Users table: user1, pass1')
        }
    }),

    // Insert some data just for testing (Favorite)
    // username: user1
    // password: pass1
    db.run(`
        
        INSERT INTO Favorite(userId, characterId, characterName) VALUES (?, ?, ?)

    `, ['1', '1', 'Test_1'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added on Users table: user1, pass1')
        }
    }),
    
    db.run(`
        
        INSERT INTO Favorite(userId, characterId, characterName) VALUES (?, ?, ?)

    `, ['1', '5', 'Test_5'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added on Users table: user1, pass1')
        }
    }),

    db.run(`
        
        INSERT INTO Favorite(userId, characterId, characterName) VALUES (?, ?, ?)

    `, ['1', '10', 'Test_10'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added on Users table: user1, pass1')
        }
    })

})

module.exports = db 