// Accessing the Service that we just created

var UserService = require('../services/users.service')

exports.authenticateUser = async function (req, res, next) {
    UserService.authenticateUser((req.body), function (error, response) {
        if (error)
            throw new Error("Error while fetching fetching data");
        response ? res.json(response) : res.status(400).json({ message: 'Username or password is incorrect' })
    });
}
exports.candidate_login = async function (req, res, next) {
    UserService.candidate_login((req.body), function (error, response) {
        if (error)
            throw new Error("Error while fetching fetching data");
        response ? res.json(response) : res.status(400).json({ message: 'Username or password is incorrect' })
    });
}

