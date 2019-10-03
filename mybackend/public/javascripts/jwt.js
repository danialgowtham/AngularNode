const expressJwt = require('express-jwt');
const config = require('../../config.json');
var http = require('http');

module.exports = jwt;
function jwt() {
    const secret = config.secret;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticateUser',
            '/socket.io/',
            '/employee_skill_mapping/upload_candidate_document/',
            '/employee_skill_mapping/check_candidate_document/',
        ]
    });
}

async function isRevoked(req, payload, done) {
    var reqGet = http.request(config.webservice_url + "getEmployeeById/" + payload.sub, function (res) {
        res.on('data', function (data) {
            user_detail = JSON.parse(data);
            if (user_detail) {
                return done(true);
            } else {
                done();
            }
        });
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.log("inside error");
        console.error(e);
    });
};
