// Accessing the Service that we just created
var WebserviceService = require('../services/webservices.service')

exports.getEmployeeDetail = async function (req, res, next) {
    try {
        WebserviceService.getEmployeeDetail(req.params.employee_id, function (err, result) {
            if (err)
                res.send(err);
            res.send(result);
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.getEmployeeByID = async function (req, res, next) {
    console.log(req.params.employee_id);
    try {
        WebserviceService.getEmployeeById(req.params.employee_id, function (err, result) {
            if (err)
                res.send(err);
            res.send(result);
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.getReporteeList = async function (req, res, next) {
    console.log(req.params.manager_id);
    try {
        WebserviceService.getReporteeList(req.params.manager_id, function (err, result) {
            if (err)
                res.send(err);
            res.send(result);
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.login = async function (req, res, next) {
    WebserviceService.login(req.params.username, req.params.password, function (err, result) {
        if (err)
            res.status(400).json({ status: 400, message: "Something Went Wrong" })
        if (Object.keys(result).length > 0)
            res.status(201).json({ status: 201, data: result, message: "Valid User" })
        else
            res.status(201).json({ status: 400, data: result, message: "Invalid User" })
    });
}
exports.getBands = async function (req, res, next) {
    WebserviceService.getBands(function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    });
}
exports.getEmployeeList = async function (req, res, next) {
    WebserviceService.getEmployeeList(function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    });
}
exports.getEmployeeBandAndUnitDetail = async function (req, res, next) {
    console.log(req.params.employee_id);
    try {
        WebserviceService.getEmployeeBandAndUnitDetail(req.params.employee_id, function (err, result) {
            if (err)
                res.send(err);
            res.send(result);
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.getFliteredEmployeeList = async function (req, res, next) {
    WebserviceService.getFliteredEmployeeList(req.params.filtered_value, function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    });
}
