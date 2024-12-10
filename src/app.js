const express = require('express')
const app = express()
const PORT = 3000
require('dotenv').config()

/* START DB CONNECTION */
require('./db/connection')

/* MIDDLEWARES */
app.use(express.json()) // Sends and receives json data

const cookieParser = require('cookie-parser')
app.use(cookieParser()) // Parses cookie header and creates req.cookies object, which is simpler to access

// Cors -> Determine origins that can access this api. 
const cors = require('cors')
const corsOptions = {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allows for data to be saved on cookies
}
app.use(cors(corsOptions))

/* ROUTES */
const router = require('./routes/router')
app.use(router) 

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})