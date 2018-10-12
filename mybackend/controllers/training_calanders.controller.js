// Accessing the Service that we just created

var TraingCalanderService = require('../services/training_calalnder.service')


var url = require('url');


_this = this


// Async Controller function to get the Users List

exports.getTrainings = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    console.log(req.query);
    console.log("hello");
    var training_query_data=req.query
    var condition={$match:{$and:[{deleted :false}]}}
    req.query.title?condition.$match.$and.push({'title': {$regex:training_query_data.title}}):'';
    req.query.nom_type?condition.$match.$and.push({'nomination_type':  {$regex:training_query_data.nom_type}}):'';
    var page = req.query.page_no ? req.query.page_no : 1;
   console.log(page);
   console.log(page);
   console.log(JSON.stringify(condition));
    var limit =15; 
    try{
    
        var users = await TraingCalanderService.getTrainings({}, page, limit, condition)
        
        // Return the training list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: users, message: "Succesfully get training details"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.createTraining = async function(req, res, next){

    // Req.Body contains the form submit values.
    
    try{
        // Calling the Service function with the new object from the Request Body
    
        var createtraing = await TraingCalanderService.createTraining(req.body)
        return res.status(201).json({status: 201, data: createtraing, message: "Succesfully Created Training"})
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: "Training Creation was Unsuccesfull"})
    }
}

exports.updateTraining = async function(req, res, next){

    // Id is necessary for the update
    
    if(!req.params.id){
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

   
   
    try{
        var updatedTraining = await TraingCalanderService.updateTraining(req.params.id,req.body)
        return res.status(200).json({status: 200, data: updatedTraining, message: "Succesfully Updated Training"})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
}



exports.getTrainingById=async function (req, res, next) {
    //reading parameter from url //$_GET['id']
    // var url_parts = url.parse(req.url, true);
    // var query = url_parts.query;
    // var id = req.query.id;
    // console.log(req.params.id);
    TraingCalanderService.getTrainingById(req.params.id)
        .then(training => training ? res.json(training) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.get_bands=async function (req, res, next) {
    console.log("inside band")
    TraingCalanderService.get_bands()
        .then(bands => bands ? res.json(bands) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.get_units=async function (req, res, next) {
    console.log("inside unit")
    TraingCalanderService.get_units()
        .then(units => units ? res.json(units) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.get_locations=async function (req, res, next) {
    console.log("inside location")
    TraingCalanderService.get_locations()
        .then(locations => locations ? res.json(locations) : res.sendStatus(404))
        .catch(err => next(err));
}


