const express = require('express')
const router = express.Router()

// Routes
// User
// ...
router.use('/api/user', require('./userRoutes'))

// Test router
router.get('/', (req, res) => {
    res.status(200).json({message: 'Api running'})
})

// 404 router
router.get('*', (req, res) => {
    res.status(404).json({message: 'Route does not exist'})
})

module.exports = router