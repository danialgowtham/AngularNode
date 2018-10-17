var express = require('express')

var router = express.Router()

// Getting the User Controller that we just created

var TrainingCalanderController = require('../controllers/training_calanders.controller');

// Map each API to the Controller Functions

// very important 
//router order is very important. 
//Let the route with "id" at the bottom of any other with the same prefix route, the problem will be solved.

router.get('/getTrainings', TrainingCalanderController.getTrainings)

router.post('/createTraining', TrainingCalanderController.createTraining)

router.get('/get_bands', TrainingCalanderController.get_bands)

router.get('/get_units',TrainingCalanderController.get_units)

router.get('/get_locations',TrainingCalanderController.get_locations)

router.post('/upload',TrainingCalanderController.upload)



router.put('/:id', TrainingCalanderController.updateTraining)

router.get('/:id', TrainingCalanderController.getTrainingById)


// Export the Router

module.exports = router;