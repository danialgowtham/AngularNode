// Gettign the Newly created Mongoose Model we just created 
const jwt = require('jsonwebtoken');
const config = require('../config.json');
var http = require('http');

exports.authenticateUser = async function ({ username, password }, callback) {
    var reqGet = http.request(config.webservice_url + "login/" + username + "/" + password, function (res) {
        res.on('data', function (data) {
            user_detail = JSON.parse(data);
            if (user_detail.status == 201) {
                const userWithoutHash = user_detail["data"];
                const token = jwt.sign({ sub: userWithoutHash.id }, config.secret);//{expiresIn: config.token_life // expires in 24 hours}
                return callback(null, { ...userWithoutHash, token, is_rmg: true });
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


exports.candidate_login = async function ({ username, password }, callback) {
    var reqGet = http.request(config.webservice_url + "login/" + username + "/" + password, function (res) {
        res.on('data', function (data) {
            user_detail = JSON.parse(data);
            if (user_detail.status == 201) {
                const userWithoutHash = user_detail["data"];
                const token = jwt.sign({ sub: userWithoutHash.id }, config.secret);//{expiresIn: config.token_life // expires in 24 hours}
                return callback(null, { ...userWithoutHash, token, is_rmg: true });
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