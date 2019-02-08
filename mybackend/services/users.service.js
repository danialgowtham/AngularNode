// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/user.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config.json');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the To do List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }

    // Try Catch the awaited promise to handle the error 

    try {
        var users = await User.paginate(query, options);

        // Return the users list that was retured by the mongoose promise
        return users;

    } catch (e) {

        // return a Error message describing the reason 
        throw Error('Error while Paginating Todos')
    }
}
exports.createUser = async function (userParam) {
    // validate
    console.log(userParam);
    // if (await User.findOne({ username: userParam.username })) {
    //     throw 'Username "' + userParam.username + '" is already taken';
    // }

    const user = new User(userParam);

    // hash password
    // if (userParam.password) {
    //     // user.hash = bcrypt.hashSync(userParam.password, 10);
    //     user.password = crypto.createHash('md5').update(userParam.password).digest("hex");
    // }

    // save user
    await user.save();
}

exports.updateUser = async function (userParam) {
    var id = userParam.id

    try {
        //Find the users Object by the Id

        var oldUser = await User.findById(id);
    } catch (e) {
        throw Error("Error occured while Finding the Todo")
    }

    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }

    console.log(oldUser)

    // hash password if it was entered
    if (userParam.password) {
        userParam.password = bcrypt.hashSync(userParam.password, 10);
    }

    //Edit the User Object
    oldUser.username = userParam.username
    oldUser.password = userParam.password



    console.log(oldUser)

    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUser = async function (id) {

    // Delete the User
    try {
        var deleted = await User.remove({ _id: id })
        if (deleted.result.n === 0) {
            throw Error("User Could not be deleted")
        }
        return deleted
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}

exports.authenticateUser = async function ({ username, password }) {
    const user = await User.findOne({ username });
    // md5 = new Md5();
    console.log(username);
    console.log(password);

    var compare_pass = crypto.createHash('md5').update(password).digest("hex");
    console.log(compare_pass);
    // if (user && bcrypt.compareSync(password, user.password:)) {
    if (user && (compare_pass == user.password)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret,{expiresIn: config.token_life // expires in 24 hours
          });
        return {
            ...userWithoutHash,
            token
        };
    }
}


exports.getUserById = async function (id) {
    //return await User.find({"id":id});
    return await User.aggregate([

        {
            $match: {
                "id": id
            }
        },
        {
            $lookup:
            {
                from: "users",
                localField: "manager",
                foreignField: "id",
                as: "manger_detail"
            }
        }
    ])
}