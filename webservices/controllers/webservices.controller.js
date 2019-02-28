// Accessing the Service that we just created
var WebserviceService = require('../services/webservices.service')

exports.getEmployeeDetail = async function (req, res, next) {
    console.log(req.params.employee_id);
    WebserviceService.getEmployeeDetail(req.params.employee_id, function (err, result) {
        console.log('Inside controller')
        if (err)
            res.send(err);
        console.log('res', result);
        res.send(result);
    });
}
exports.getEmployeeByID = async function (req, res, next) {
    console.log(req.params.employee_id);
    WebserviceService.getEmployeeById(req.params.employee_id, function (err, result) {
        console.log('Inside controller')
        if (err)
            res.send(err);
        console.log('res', result);
        res.send(result);
    });
}
exports.getReporteeList = async function (req, res, next) {
    console.log(req.params.manager_id);
    WebserviceService.getReporteeList(req.params.manager_id, function (err, result) {
        console.log('Inside controller')
        if (err)
            res.send(err);
        console.log('res', result);
        res.send(result);
    });
}
exports.login = async function (req, res, next) {
    WebserviceService.login(req.params.username, req.params.password, function (err, result) {
        if (err)
            res.status(400).json({ status: 400, message: "Something Went Wrong" })
        console.log('res', result);
        if (Object.keys(result).length > 0)
            res.status(201).json({ status: 201, data: result, message: "Valid User" })
        else
            res.status(201).json({ status: 400, data: result, message: "Invalid User" })
    });
}
