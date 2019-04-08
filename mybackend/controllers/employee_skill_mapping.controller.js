// Accessing the Service that we just created

var EmployeeSkillMappingService = require('../services/employee_skill_mapping.service')
var http = require('http');
const config = require('../config.json');
//for export
// const excel = require('node-excel-export');

const mail = require('../public/javascripts/mail');


exports.get_units = async function (req, res, next) {
    EmployeeSkillMappingService.get_units(req.params.parent_id)
        .then(units => units ? res.json(units) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.get_competency = async function (req, res, next) {
    EmployeeSkillMappingService.get_competency(req.params.sub_sbu_id, req.body)
        .then(competencies => competencies ? res.json(competencies) : res.sendStatus(404))
        .catch(err => next(err));
}

exports.get_skill = async function (req, res, next) {
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
        var skill = await EmployeeSkillMappingService.get_competency_mapping(condition)
        getEmployeeDetail(req.params.employee_id, function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 201, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
            return res.status(201).json({ status: 201, data: { skill, employee_detail }, message: "Skills Get Succesfully" })
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_employee_detail = async function (req, res, next) {
    getEmployeeDetail(req.params.employee_id, function (error, response) {
        if (error)
            return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
        return res.status(201).json({ status: 201, data: response, message: "Employee Details Got Succesfully" })
    })
}


exports.get_reportee_mapping_list = async function (req, res, next) {
    try {
        geReporteeList(req.params.manager_id, function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
            var reportee_list = Object.keys(employee_detail);
            EmployeeSkillMappingService.get_employee_mapping_list(reportee_list)
                .then(employee_skill_data => {
                    employee_skill_data ? res.status(201).json({ status: 201, data: { employee_skill_data, employee_detail }, message: "Employee Skill Data Get Succesfully" }) : res.status(400).json({ message: 'Something Went Wrong' })
                })
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_proficiency = async function (req, res, next) {
    try {
        var proficiency_list = await EmployeeSkillMappingService.get_proficiency()
        return res.status(201).json({ status: 201, data: proficiency_list, message: "Get Proficiency" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}
exports.save_manger_proficiency = async function (req, res, next) {
    try {
        await EmployeeSkillMappingService.save_manger_proficiency(req.body, req.params.employee_id, req.params.manager_id)
        return res.status(201).json({ status: 201, message: "Skill Set Approved Succesfully" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_bands = async function (req, res, next) {
    geBands(function (error, response) {
        if (error)
            return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
        return res.status(201).json({ status: 201, data: response, message: "Band list Got Succesfully" })
    })
}

exports.get_roles = async function (req, res, next) {
    try {
        var role_list = await EmployeeSkillMappingService.get_roles(req.params.unit_id, req.params.band_name)
        return res.status(201).json({ status: 201, data: role_list, message: "Get Roles" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_job_codes = async function (req, res, next) {
    try {
        var job_code_list = await EmployeeSkillMappingService.get_job_codes(req.params.role_name, req.params.band_name)
        return res.status(201).json({ status: 201, data: job_code_list, message: "Get Job Code" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}
exports.get_job_detail = async function (req, res, next) {
    try {
        var job_detail = await EmployeeSkillMappingService.get_job_detail(req.params.id);
        var employee_mapping_detail = await EmployeeSkillMappingService.get_employee_mapping_detail(req.params.employee_id);
        var job_fitment_score = 0;
        for (i = 0; i < job_detail.length; i++) {
            for (j = 0; j < employee_mapping_detail.length; j++) {

                if ((job_detail[i]["competency_id"] == employee_mapping_detail[j]["competency_id"]) && (job_detail[i]["skill_id"] == employee_mapping_detail[j]["skill_id"])) {
                    job_detail[i].employee_proficiency = employee_mapping_detail[j]["manager_proficiency_name"];
                    bg_color = null;
                    if (job_detail[i]["skill_proficiency"] == employee_mapping_detail[j]["manager_proficiency"]) {
                        bg_color = "bg-success";
                        job_fitment_score += 1;
                        job_detail[i].fitment_score = 1;
                    } else if (job_detail[i]["skill_proficiency"] < employee_mapping_detail[j]["manager_proficiency"]) {
                        bg_color = "bg-purple";
                        job_detail[i].fitment_score = 0;
                    } else if ((Number(job_detail[i]["skill_proficiency"]) - 1) == employee_mapping_detail[j]["manager_proficiency"]) {
                        bg_color = "bg-warning";
                        job_fitment_score += 0.5;
                        job_detail[i].fitment_score = 0.5;
                    } else {
                        bg_color = "bg-danger";
                        job_detail[i].fitment_score = 0;
                    }
                    job_detail[i].color_code = bg_color;
                    break;
                } else {
                    job_detail[i].employee_proficiency = "Nil Experience";
                    job_detail[i].color_code = "bg-danger";
                    job_detail[i].fitment_score = 0;
                }
            }
        }
        var fitment_score_percentage = 0;
        if (job_detail.length > 0) {
            var fitment_score = (100 / job_detail.length) * job_fitment_score;
            fitment_score_percentage = Math.round(fitment_score)

        }
        return res.status(201).json({ status: 201, data: { job_detail, fitment_score_percentage }, message: "Get Job Detail" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}
exports.get_proficiency_list = async function (req, res, next) {
    try {
        var proficiency_list = await EmployeeSkillMappingService.get_proficiency_list(req.params.id)
        return res.status(201).json({ status: 201, data: proficiency_list, message: "Get Proficiency" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_employee_list = async function (req, res, next) {
    getEmployeeList(function (error, response) {
        if (error)
            return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
        return res.status(201).json({ status: 201, data: response, message: "Employee List Got Succesfully" })
    })
}
exports.get_reportee_list = async function (req, res, next) {
    geReporteeList(req.params.employee_id, function (error, response) {
        if (error)
            return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
        return res.status(201).json({ status: 201, data: response, message: "Employee List Got Succesfully" })
    })
}


exports.get_employee_mapping_list = async function (req, res, next) {
    try {
        if (Object.keys(req.body).length == 0) {
            getEmployeeList(function (error, employee_detail) {
                if (error)
                    return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
                var employee_list = Object.keys(employee_detail);
                console.log(employee_list);
                EmployeeSkillMappingService.get_employee_mapping_list(employee_list)
                    .then(employee_skill_data => {
                        employee_skill_data ? res.status(201).json({ data: { employee_skill_data, employee_detail }, message: "Employee Skill Data Get Succesfully" }) : res.status(400).json({ message: 'Something Went Wrong' })
                    });
            })
        } else {
            try {
                var condition = { $match: { deleted: false } };
                console.log(req.body);
                console.log(req.body.skill);
                if (req.body.employee)
                    condition.$match.employee_id = String(req.body.employee.id);
                if (req.body.skill.length > 0) {
                    condition.$match.$and = [];
                    for (var skill of req.body.skill) {
                        condition.$match.$and.push({ merged_object: { "$elemMatch": { "skill_master_id": String(skill.skill_id), "manager_proficiency": String(skill.id) } } });
                    }
                }
                EmployeeSkillMappingService.get_filtered_employee_mapping_list(condition)
                    .then(employee_skill_data => {
                        employee_skill_data ? res.status(201).json({ status: 201, data: { employee_skill_data }, message: "Employee Skill Data Get Succesfully" }) : res.status(400).json({ message: 'Something Went Wrong' })
                    })
            }
            catch (err) {
                console.log(error);
            }
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_skill_list = async function (req, res, next) {
    try {
        var skill_list = await EmployeeSkillMappingService.get_skill_list();
        var proficiency_list = await EmployeeSkillMappingService.get_proficiency();
        var skill_proficiency_array = [];
        console.log(proficiency_list)
        // console.log(skill_list)
        for (var skill of skill_list) {
            for (var proficiency of proficiency_list) {
                if (proficiency.proficiency_name != 'Not Applicable')
                    skill_proficiency_array.push({ ...skill, ...proficiency });
            }
        }
        return res.status(201).json({ status: 201, data: { skill_proficiency_array }, message: "Get Skill" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}


function getEmployeeDetail(employee_id, callback) {
    var return_data;
    var reqGet = http.request(config.webservice_url + "getEmployeeDetail/" + employee_id, function (res) {
        res.on('data', function (data) {
            try {
                return_data = JSON.parse(data);
                return callback(null, return_data);
            } catch (err) {
                console.error(err)
            }
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
        var buffers = [];
        res
            .on('data', function (chunk) {
                buffers.push(chunk)

            })
            .on('end', function () {
                try {
                    return_data = JSON.parse(Buffer.concat(buffers).toString());
                    return callback(null, return_data);
                } catch (err) {
                    console.error(err)
                }
            })
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.log("inside error");
        console.error(e);
    });

}
function geBands(callback) {
    var reqGet = http.request(config.webservice_url + "getBands/", function (res) {
        res.on('data', function (data) {
            try {
                return_data = JSON.parse(data);
                return callback(null, return_data);
            } catch (err) {
                console.error(err)
            }
        });
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.log("inside error");
        console.error(e);
    });

}
function getEmployeeList(callback) {
    var return_data;
    var reqGet = http.request(config.webservice_url + "getEmployeeList/", function (res) {
        var buffers = [];
        res
            .on('data', function (chunk) {
                buffers.push(chunk)

            })
            .on('end', function () {
                try {
                    return_data = JSON.parse(Buffer.concat(buffers).toString());
                    return callback(null, return_data);
                } catch (err) {
                    console.error(err)
                }
            })

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


