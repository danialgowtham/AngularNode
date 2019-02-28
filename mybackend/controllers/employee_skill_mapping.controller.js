// Accessing the Service that we just created

var EmployeeSkillMappingService = require('../services/employee_skill_mapping.service')
var http = require('http');
const config = require('../config.json');
//for export
// const excel = require('node-excel-export');

const mail = require('../public/javascripts/mail');


exports.get_units = async function (req, res, next) {
    console.log("inside unit")
    EmployeeSkillMappingService.get_units(req.params.parent_id)
        .then(units => units ? res.json(units) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.get_competency = async function (req, res, next) {
    console.log("inside Competency");
    console.log(req.body);
    EmployeeSkillMappingService.get_competency(req.params.sub_sbu_id, req.body)
        .then(competencies => competencies ? res.json(competencies) : res.sendStatus(404))
        .catch(err => next(err));
}

exports.get_skill = async function (req, res, next) {
    console.log("inside Skill");
    console.log(req.body);
    EmployeeSkillMappingService.get_skill(req.params.com_str_map_id, req.body)
        .then(skills => skills ? res.json(skills) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.save_competency_mapping = async function (req, res, next) {
    try {
        await EmployeeSkillMappingService.save_competency_mapping(req.body)
        return res.status(201).json({ status: 201, message: "Skill Set Submitted Succesfully" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }

}
exports.get_competency_mapping = async function (req, res, next) {
    try {

        var condition = { $match: { $and: [{ deleted: false }, { 'employee_id': req.params.employee_id }] } }
        if (req.params.type != 'null') {
            condition.$match.$and.push({ 'employee_skill_set.status': req.params.type });
        }
        var skill_data = await EmployeeSkillMappingService.get_competency_mapping(condition)
        var mapping_data = {};
        getEmployeeDetail(req.params.employee_id, function (error, response) {
            console.log(error);
            if (error)
                return res.status(400).json({ status: 201, data: response, message: "Something went wrong. Unable connect mysql webservices" })
            mapping_data["employee_detail"] = response
            mapping_data["skill"] = skill_data;
            console.log(mapping_data);
            return res.status(201).json({ status: 201, data: mapping_data, message: "Skills Get Succesfully" })
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_employee_detail = async function (req, res, next) {
    getEmployeeDetail(req.params.employee_id, function (error, response) {
        if (error)
            return res.status(400).json({ status: 201, data: response, message: "Something went wrong. Unable connect mysql webservices" })
        return res.status(201).json({ status: 201, data: response, message: "Employee Details Got Succesfully" })
    })
}


exports.get_employee_mapping_list = async function (req, res, next) {
    try {
        geReporteeList(req.params.manager_id, function (error, response) {
            if (error)
                return res.status(400).json({ status: 400, data: response, message: "Something went wrong. Unable connect mysql webservices" })
            var reportee_list = Object.keys(response)

            EmployeeSkillMappingService.get_employee_mapping_list(reportee_list)
                .then(employee_skill_data => {

                    for (var index in employee_skill_data) {
                        Object.assign(employee_skill_data[index], response[employee_skill_data[index].employee_id]);
                    }
                    console.log(employee_skill_data);
                    employee_skill_data ? res.status(201).json({ status: 201, data: employee_skill_data, message: "Employee Skill Data Get Succesfully" }) : res.status(400).json({ message: 'Something Went Wrong' })
                })
            // return res.status(201).json({ status: 201, data: employee_skill_data, message: "Employee Skill Data Get Succesfully" })
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_proficiency = async function (req, res, next) {
    try {
        var proficiency_list = await EmployeeSkillMappingService.get_proficiency()
        console.log(proficiency_list);
        return res.status(201).json({ status: 201, data: proficiency_list, message: "Get Proficiency" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}
exports.save_manger_proficiency = async function (req, res, next) {
    console.log(req.body);
    try {
        await EmployeeSkillMappingService.save_manger_proficiency(req.body, req.params.employee_id, req.params.manager_id)
        return res.status(201).json({ status: 201, message: "Skill Set Approved Succesfully" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

function getEmployeeDetail(employee_id, callback) {
    var return_data;
    var reqGet = http.request(config.webservice_url + "getEmployeeDetail/" + employee_id, function (res) {
        res.on('data', function (data) {
            return_data = JSON.parse(data);
            return callback(null, return_data);
        });
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.log("inside error");
        console.error(e);
    });

}
function geReporteeList(manager_id, callback) {
    var return_data;
    var reqGet = http.request(config.webservice_url + "getReporteeList/" + manager_id, function (res) {
        res.on('data', function (data) {
            return_data = JSON.parse(data);
            return callback(null, return_data);
        });
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.log("inside error");
        console.error(e);
    });

}

function send_mail(type) {
    var subject = '';
    var body = '';
    if (type == 'create') {
        subject = "Add Training Calander";
        body = "Training calander created successfully!!!";
    } else if (type == 'update') {
        subject = "Update Training Calander";
        body = "Training calander modified successfully!!!";

    }


    var mailOptions = {
        from: 'gowdham.kasi@hindujatech.com',
        to: 'gowdham.kasi@hindujatech.com',
        subject: subject,
        text: body
    };

    mail.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}


