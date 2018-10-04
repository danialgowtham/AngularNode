const expressJwt = require('express-jwt');
const config = require('../../config.json');
const userService = require('../../services/users.service');

module.exports = jwt;
function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticateUser',
            '/users/createUser'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getUserById(payload.sub);
    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};