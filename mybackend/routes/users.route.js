var express = require('express')

var router = express.Router()

// Getting the User Controller that we just created

var UserController = require('../controllers/users.controller');

// Map each API to the Controller FUnctions

router.get('/getUsers/:page', UserController.getUsers)

router.post('/createUser', UserController.createUser)

router.put('/:id', UserController.updateUser)

router.get('/:id', UserController.getUserById)

router.post('/authenticateUser', UserController.authenticateUser)

router.delete('/:id',UserController.removeUser)

router.post('/getNasaData', UserController.getNasaData)

// Export the Router
module.exports = router;