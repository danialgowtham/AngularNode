// Accessing the Service that we just created

var UserService = require('../services/users.service')
// const express = require('express');
// const router = express.Router();
var url = require('url');


_this = this


// Async Controller function to get the Users List

exports.getUsers = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    
    var page = req.params.page ? req.params.page : 1
    var limit =15; 

    try{
    
        var users = await UserService.getUsers({}, page, limit)
        
        // Return the users list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: users, message: "Succesfully Users Recieved"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.createUser = async function(req, res, next){

    // Req.Body contains the form submit values.
    
    var user = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }
    try{
        
        // Calling the Service function with the new object from the Request Body
    
        var createdUser = await UserService.createUser(user)
        return res.status(201).json({status: 201, data: createdUser, message: "Succesfully Created User"})
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: "User Creation was Unsuccesfull"})
    }
}

exports.updateUser = async function(req, res, next){

    // Id is necessary for the update

    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;

    console.log(req.body)

    var user = {
        id,
        username: req.body.username ? req.body.username : null,
        password: req.body.password ? req.body.password : null
    }

    try{
        var updatedUser = await UserService.updateUser(user)
        return res.status(200).json({status: 200, data: updatedUser, message: "Succesfully Updated Tod"})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeUser = async function(req, res, next){

    var id = req.params.id;

    try{
        var deleted = await UserService.deleteUser(id)
        return res.status(204).json({status:204, message: "Succesfully Todo Deleted"})
    }catch(e){
        return res.status(400).json({status: 400, message: e.message})
    }

}

exports.getUserById=async function (req, res, next) {
    //reading parameter from url //$_GET['id']
    // var url_parts = url.parse(req.url, true);
    // var query = url_parts.query;
    // var id = req.query.id;
    // console.log(req.params.id);
    UserService.getUserById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}


exports.authenticateUser= async function (req, res, next) {
    UserService.authenticateUser(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}