// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/user.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const config = require('../config.json');
var http = require('http');

exports.authenticateUser = async function ({ username, password },callback) {
    var reqGet = http.request(config.webservice_url + "login/" + username + "/" + password, function (res) {
        res.on('data', function (data) {
            user_detail = JSON.parse(data);
            if (user_detail.status == 201) {
                const userWithoutHash = user_detail["data"];
                const token = jwt.sign({ sub: userWithoutHash.id }, config.secret, {
                    expiresIn: config.token_life // expires in 24 hours
                });
                console.log({ userWithoutHash, token });
                return callback(null, { ...userWithoutHash, token });
            } else {
                return callback(null, null);
            }
        });
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.log("inside error");
        console.error(e);
    });
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