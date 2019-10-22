// Accessing the Service that we just created

var EmployeeSkillMappingService = require('../services/employee_skill_mapping.service')
var http = require('http');
const config = require('../config.json');
// const mail = require('../public/javascripts/mail');
// var querystring = require('querystring');
var formidable = require('formidable');
var path = require("path");
// const HummusRecipe = require('hummus-recipe');
var fs = require('fs');
var pdf = require('html-pdf');
var moment = require('moment');
// var sprintf = require('sprintf-js').sprintf
//for export
const excel = require('node-excel-export');

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
        console.log(req.body);
        await EmployeeSkillMappingService.save_competency_mapping(req.body)
        return res.status(201).json({ status: 201, message: "Skill Set Submitted Succesfully" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }

}
exports.get_competency_mapping = async function (req, res, next) {
    try {
        var current_role = '';
        var condition = { $match: { $and: [{ deleted: false }, { 'employee_id': req.params.employee_id }] } }
        if (req.params.type != 'null') {
            condition.$match.$and.push({ 'employee_skill_set.status': req.params.type });
        }
        if (req.params.experience_type != 'null') {
            condition.$match.$and.push({ 'employee_skill_set.experience_month': { $ne: null } });
        }
        var skill = await EmployeeSkillMappingService.get_competency_mapping(condition)
        getEmployeeDetail(req.params.employee_id, function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 201, data: {}, message: "Something went wrong. Unable connect mysql webservices" });
            if (skill.length > 0) {
                current_role = skill[0]["current_role"];
            }
            return res.status(201).json({ status: 201, data: { skill, employee_detail, current_role }, message: "Skills Get Succesfully" })
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
        console.log(req.body);
        await EmployeeSkillMappingService.save_manger_proficiency(req.body.mapping_data, req.params.employee_id, req.params.manager_id, req.body.current_role)
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
        var job_detail = await EmployeeSkillMappingService.get_job_detail(req.params.id, req.params.job_post_id);
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
                EmployeeSkillMappingService.get_employee_mapping_list(employee_list)
                    .then(employee_skill_data => {
                        employee_skill_data ? res.status(201).json({ data: { employee_skill_data, employee_detail }, message: "Employee Skill Data Get Succesfully" }) : res.status(400).json({ message: 'Something Went Wrong' })
                    });
            })
        } else {
            try {
                var condition = { $match: { deleted: false } };
                if (req.body.employee)
                    condition.$match.employee_id = String(req.body.employee.id);
                if (req.body.skill.length > 0) {
                    condition.$match.$and = [];
                    for (var skill of req.body.skill) {
                        condition.$match.$and.push({ merged_object: { "$elemMatch": { "skill_master_id": String(skill.skill_id), "manager_proficiency": String(skill.id) } } });
                    }
                }
                if (req.body.role)
                    condition.$match.current_role = String(req.body.role)
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
exports.get_role = async function (req, res, next) {
    try {
        var employee_id = req.params.employee_id;
        getEmployeeBandAndUnitDetail(employee_id, function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
            EmployeeSkillMappingService.get_role(employee_detail)
                .then(role_list => {
                    role_list ? res.status(201).json({ data: { role_list }, message: "Employee Role Data Get Succesfully" }) : res.status(400).json({ message: 'Something Went Wrong' })
                });
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}
exports.get_role_list = async function (req, res, next) {
    try {
        var condition = { $match: { $and: [{ deleted: "0" }] } }
        req.params.filtered_value ? condition.$match.$and.push({ 'role': { $regex: req.params.filtered_value, $options: "i" } }) : '';
        console.log(condition);
        var role_list = await EmployeeSkillMappingService.get_role_list(condition)
        return res.status(201).json({ data: { role_list }, message: "Employee Role Data Get Succesfully" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}
exports.get_filtered_employee_list = async function (req, res, next) {
    getFliteredEmployeeList(req.params.filtered_value, function (error, response) {
        if (error)
            return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
        return res.status(201).json({ status: 201, data: response, message: "Employee List Got Succesfully" })
    })
}

exports.create_new_internal_job = async function (req, res, next) {
    try {
        await EmployeeSkillMappingService.create_new_internal_job(req.body, req.params.employee_id)
        return res.status(201).json({ status: 201, message: "Job Posted Succesfully" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}


exports.get_internal_job = async function (req, res, next) {
    try {
        var job_posts = await EmployeeSkillMappingService.get_internal_job();

        var employee_ids = [];
        for (var object of job_posts) {
            employee_ids.push(object.created_by);
        }
        getSelectedEmployeeList(employee_ids, function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })

            EmployeeSkillMappingService.get_internal_job()
                .then(internal_job_list => {
                    internal_job_list ? res.status(201).json({ data: { internal_job_list, employee_detail }, message: "Job List Data Get Succesfully" }) : res.status(400).json({ message: 'Something Went Wrong' })
                });
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}

exports.get_internal_job_detail = async function (req, res, next) {
    try {
        var job_post_details = await EmployeeSkillMappingService.get_internal_job_detail(req.params.job_id);
        var job_post_detail = job_post_details["job_post_detail"][0];
        var employee_ids = [];
        employee_ids.push(job_post_detail.created_by);
        for (var object of job_post_detail.applied_employees) {
            employee_ids.push(object.employee_id);
        }
        getSelectedEmployeeList(employee_ids, function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
            else
                return res.status(201).json({ status: 201, data: { job_post_details, employee_detail }, message: "Job detail Get Succesfully" })
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}


exports.update_internal_job_detail = async function (req, res, next) {
    try {
        await EmployeeSkillMappingService.update_internal_job_detail(req.params.job_post_id, req.params.status, req.body)
        return res.status(201).json({ status: 201, message: "Job Post Detail Updated Succesfully" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}


exports.get_open_internal_jobs = async function (req, res, next) {
    try {
        var job_list = await EmployeeSkillMappingService.get_open_internal_jobs();
        console.log(job_list);
        return res.status(201).json({ status: 201, data: job_list, message: "Get Job List Successfully" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}


exports.apply_job = async function (req, res, next) {
    try {
        await EmployeeSkillMappingService.apply_job(req.params.job_post_id, req.params.employee_id, req.params.manager_agreed)
        return res.status(201).json({ status: 201, message: "Job Post Detail Updated Succesfully" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}


exports.check_apply_job = async function (req, res, next) {
    try {
        var applied_job_data = await EmployeeSkillMappingService.check_apply_job(req.params.job_post_id, req.params.employee_id, req.params.fitment_score);
        return res.status(201).json({ status: 201, data: applied_job_data, message: "Job Already Applied Check Call Working Successfully" })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" })
    }
}


exports.get_applied_job_post = async function (req, res, next) {
    try {
        var applied_job_list = await EmployeeSkillMappingService.get_applied_job_post(req.params.employee_id)
        return res.status(201).json({ status: 201, data: applied_job_list, message: "Applied Job Details List Succesfully" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.get_rrf_creation_data = async function (req, res, next) {
    try {
        var unit = await EmployeeSkillMappingService.get_units("0");
        geRRFCreationDetail(function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
            else
                return res.status(201).json({ status: 201, data: { unit, ...employee_detail }, message: "Job detail Get Succesfully" })
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.get_project = async function (req, res, next) {
    try {
        getProject(req.params.customer_id, function (error, project_list) {
            if (error)
                return res.sendStatus(404)
            else
                return res.json(project_list)
        })
    } catch (e) {
        return res.sendStatus(404)
    }
}

exports.get_sub_work_locations = async function (req, res, next) {
    try {
        getSubWorkLocations(req.params.location_name, function (error, location_list) {
            if (error)
                return res.sendStatus(404)
            else
                return res.json(location_list)
        })
    } catch (e) {
        return res.sendStatus(404)
    }
}

exports.create_new_rrf = async function (req, res, next) {
    try {
        var form = new formidable.IncomingForm()
        form.parse(req);
        var file_name = '';
        save_object = {};
        form.on('fileBegin', function (name, file) {
            file_name = new Date().getTime() + "." + file.name.split('.').pop();
            file.path = path.join(__dirname, '..') + "\\public\\customer_job_description\\" + file_name;
        })
        form.on('field', function (name, field) {
            if (name == "disselected_job_competency" || name == "interview_panel")
                save_object[name] = JSON.parse(field);
            else
                save_object[name] = field;
        })
        form.on('error', function (err) {
            res.status(500).json({ status: 200, message: "Error While Uploading File" });
        })
        form.on('end', function () {
            if (file_name)
                save_object["customer_job_description"] = "customer_job_description/" + file_name;
            if (save_object['rrf_id'] == '') {
                EmployeeSkillMappingService.create_new_rrf(save_object, req.params.employee_id).
                    then(candidate_object => {
                        candidate_object ? res.status(201).json({ status: 201, data: candidate_object, message: "RRF Created Succesfully" }) : res.status(500).json({ status: 500, message: "Something Went Wrong" });
                    })
                    .catch(err => next(err));
                return res.status(201).json({ status: 201, message: "RRF Created Succesfully" });
            } else {
                EmployeeSkillMappingService.update_rrf(save_object).
                    then(candidate_object => {
                        candidate_object ? res.status(201).json({ status: 201, data: candidate_object, message: "RRF Created Succesfully" }) : res.status(500).json({ status: 500, message: "Something Went Wrong" });
                    })
                    .catch(err => next(err));
            }

        });

    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.get_rrf_list = async function (req, res, next) {
    try {

        if (req.params.type == "manager") {
            geReporteeList(req.params.employee_id, function (error, employee_detail) {
                if (error)
                    return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
                var reportee_list = Object.keys(employee_detail);
                var condition = { $match: { $and: [{ deleted: false }, { 'created_by': { $in: reportee_list }, 'status': { $in: ['Submitted'] } }] } }
                EmployeeSkillMappingService.get_rrf_list(condition)
                    .then(rrf_list => {
                        rrf_list ? res.status(201).json({ status: 201, data: { rrf_list, employee_detail }, message: "RRF List Succesfully" }) : res.status(400).json({ message: 'Something Went Wrong' })
                    })
            })
        } else {
            if (req.params.type == "employee") {
                var condition = { $match: { $and: [{ deleted: false }, { 'created_by': req.params.employee_id }] } }
            } else {
                var condition = { $match: { $and: [{ deleted: false, }, { 'status': { $nin: ['Submitted', 'RM Rejected', 'RMG Rejected'] } }] } }
            }
            var rrf_list = await EmployeeSkillMappingService.get_rrf_list(condition)
            var employee_ids = [];
            for (var object of rrf_list) {
                employee_ids.push(object.created_by);
            }
            getSelectedEmployeeList(employee_ids, function (error, employee_detail) {
                if (error)
                    return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
                else
                    return res.status(201).json({ status: 201, data: { rrf_list, employee_detail }, message: "RRF List Succesfully" })
            })
        }

    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.get_rrf_detail = async function (req, res, next) {
    try {
        var rrf_detail = await EmployeeSkillMappingService.get_rrf_detail(req.params.rrf_id);
        getRrfDetail(rrf_detail["rrf_detail"], function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
            else {
                return res.status(201).json({ status: 201, data: { rrf_detail, ...employee_detail }, message: "Job detail Get Succesfully" })
            }
        });
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.update_rrf_status = async function (req, res, next) {
    try {
        try {
            await EmployeeSkillMappingService.update_rrf_status(req.params.rrf_id, req.body)
            return res.status(201).json({ status: 201, message: "RRF Detail Updated Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}
exports.get_rrf_edit_data = async function (req, res, next) {
    try {
        var result = {};
        var rrf_detail = await EmployeeSkillMappingService.get_rrf_detail(req.params.rrf_id);
        result['rrf_detail'] = rrf_detail['rrf_detail'];
        result['unit'] = await EmployeeSkillMappingService.get_units("0");
        result['practice'] = await EmployeeSkillMappingService.get_units(result['rrf_detail']["unit"]);
        result['sub_practice'] = await EmployeeSkillMappingService.get_units(result['rrf_detail']["practice"]);
        result['role'] = await EmployeeSkillMappingService.get_roles(result['rrf_detail']["unit"], result['rrf_detail']["role_band"]);
        result['job_code'] = await EmployeeSkillMappingService.get_job_codes(result['rrf_detail']["role"], result['rrf_detail']["role_band"])
        result['mapping_detail'] = await EmployeeSkillMappingService.get_job_detail(result['rrf_detail']["job_master_id"], '');
        getRRFEditData(result['rrf_detail'], function (error, edit_detail) {
            if (error)
                return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
            else
                return res.status(201).json({ status: 201, data: { ...result, ...edit_detail }, message: "RRF detail Get Succesfully" })
        })
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}
exports.upload_candidate = async function (req, res, next) {
    var form = new formidable.IncomingForm()
    form.parse(req);
    var file_name = '';
    save_object = {};
    form.on('fileBegin', function (name, file) {
        file_name = new Date().getTime() + "." + file.name.split('.').pop();
        file.path = path.join(__dirname, '..') + "\\public\\uploaded_resume\\" + file_name;
    })
    form.on('field', function (name, field) {
        save_object[name] = field;
    })
    form.on('error', function (err) {
        res.status(500).json({ status: 200, message: "Error While Uploading File" });
    })
    form.on('end', function () {
        save_object["resume"] = "uploaded_resume/" + file_name;
        save_object["uploaded_on"] = new Date();
        save_object["status"] = 'Uploaded';
        EmployeeSkillMappingService.upload_candidate(req.params.rrf_id, save_object).
            then(candidate_object => {
                candidate_object ? res.status(201).json({ status: 201, data: candidate_object, message: "Candidate Added Succesfully" }) : res.status(500).json({ status: 500, message: "Something Went Wrong" });
            })
            .catch(err => next(err));
    });
}

exports.schedule_interview = async function (req, res, next) {
    try {
        try {
            var schedule_data = await EmployeeSkillMappingService.schedule_interview(req.params.rrf_id, req.params.candidate_id, req.body)
            return res.status(201).json({ status: 201, data: schedule_data, message: "Interview Scheduled Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.get_iof_pending_list = async function (req, res, next) {
    try {
        try {
            var iof_pending_list = await EmployeeSkillMappingService.get_iof_pending_list(req.params.employee_id, req.params.candidate_id, req.body)
            return res.status(201).json({ status: 201, data: iof_pending_list, message: "IOF List Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.save_iof_detail = async function (req, res, next) {
    try {
        try {
            var iof_save_data = await EmployeeSkillMappingService.save_iof_detail(req.params.rrf_id, req.params.candidate_id, req.params.schedule_id, req.params.status, req.body)
            return res.status(201).json({ status: 201, data: iof_save_data, message: "Interview Observation Form Saved Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}


exports.get_hr_approve_pending_list = async function (req, res, next) {
    try {
        try {
            var hr_approve_pending_list = await EmployeeSkillMappingService.get_hr_approve_pending_list()
            return res.status(201).json({ status: 201, data: hr_approve_pending_list, message: "HR Approve List Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.save_hr_iof_detail = async function (req, res, next) {
    try {
        try {
            var hr_iof = await EmployeeSkillMappingService.save_hr_iof_detail(req.params.rrf_id, req.params.candidate_id, req.params.status, req.body)
            return res.status(201).json({ status: 201, data: hr_iof, message: "Interview Observation Form Hr Saved Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.get_iof_detail = async function (req, res, next) {
    try {
        try {
            var iof_detail = await EmployeeSkillMappingService.get_iof_detail(req.params.schedule_id)
            return res.status(201).json({ status: 201, data: iof_detail, message: "IOF Detail Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.candidate_duplicate_check = async function (req, res, next) {
    try {
        try {
            var duplicate_check = await EmployeeSkillMappingService.candidate_duplicate_check(req.params.rrf_id, req.params.email_id);
            return res.status(201).json({ status: 201, data: duplicate_check.length > 0 ? true : false, message: "Duplicate Check Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}
exports.generate_offer_letter = async function (req, res, next) {
    var rrf_detail = await EmployeeSkillMappingService.get_rrf_and_candidate_detail(req.params.candidate_id);
    rrf_detail = rrf_detail[0];
    rrf_detail.address = "";
    var address = rrf_detail.address.split(",");
    //rrf_detail.address.split(",");
    var html_file_band = '';
    if (req.body.band == "AT2") {
        html_file_band = req.body.band
    } else {
        html_file_band = req.body.band.charAt(0)
    }
    const offer_letter_template = path.join(__dirname, '..') + "\\public\\offer_letters\\Offer Letter Template - " + html_file_band + ".htm";
    var html = fs.readFileSync(offer_letter_template, 'utf8');
    var options = { format: 'A4', "quality": "100" };
    var ctc_data = await ctc_calculation(rrf_detail, req.body);
    var basic_salary = Math.round(ctc_data["fixed_pay"] * 0.3);
    var hra = Math.round(basic_salary / 2);
    var pf = Math.round(basic_salary * 0.12);
    var flexi_benefit_plan = ctc_data["fixed_pay"] - basic_salary - hra - pf;
    var candidate_detail = {
        rrf_number: 'HTL/' + moment().format('MMMYY') + '/' + rrf_detail.company_structure.name + ' - ' + rrf_detail.company_structure1.name + '/' + rrf_detail.rrf_master.rrf_code,
        generated_date: moment().format('MMMM, DD YYYY'),
        employee_title: "Mr",
        address_line_1: address.pop(),
        address_line_2: address.pop(),
        address_line_3: address.pop(),
        first_name: rrf_detail["candidate_name"],
        last_name: " ",
        designation: req.body.designation,
        base_location: rrf_detail["rrf_master"]["base_location"],
        joining_date: moment(req.body.date_of_joining).format('MMMM, DD YYYY'),
        band: req.body.band.charAt(0),
        sub_band: req.body.band,
        basic_salary: [Math.round(basic_salary / 12), basic_salary, "30% of (A)"],
        hra: [Math.round(hra / 12), hra, "50% of Basic"],
        flexi_benefit_plan: [Math.round(flexi_benefit_plan / 12), flexi_benefit_plan, ""],
        pf_employer_contribution: [Math.round(pf / 12), pf, "12% of Basic"],
        esi: ["", "", ""],
        total_a: [Math.round((basic_salary + hra + pf + flexi_benefit_plan) / 12), basic_salary + hra + pf + flexi_benefit_plan, ""],
        variable_compensation: [Math.round(ctc_data["variable_pay"] / 12), ctc_data["variable_pay"], ctc_data["variable_percentage"] + "% of Fixed"],
        gratuity: ctc_data["gratuity"],
        medical_insurance: ctc_data["insurance"],
        total_c: Number(ctc_data["gratuity"]) + Number(ctc_data["insurance"]),
        ctc: req.body.grand_ctc,
    }
    html = html.replace(/candidate_detail.rrf_no/gi, candidate_detail.rrf_number);
    html = html.replace(/candidate_detail.generated_date/gi, candidate_detail.generated_date);
    html = html.replace(/candidate_detail.employee_title/gi, candidate_detail.employee_title);
    html = html.replace(/candidate_detail.address_line_1/gi, candidate_detail.address_line_1);
    html = html.replace(/candidate_detail.address_line_2/gi, candidate_detail.address_line_2);
    html = html.replace(/candidate_detail.address_line_3/gi, candidate_detail.address_line_3);
    html = html.replace(/candidate_detail.first_name/gi, candidate_detail.first_name);
    html = html.replace(/candidate_detail.last_name/gi, candidate_detail.last_name);
    html = html.replace(/candidate_detail.designation/gi, candidate_detail.designation);
    html = html.replace(/candidate_detail.base_location/gi, candidate_detail.base_location);
    html = html.replace(/candidate_detail.joining_date/gi, candidate_detail.joining_date);
    html = html.replace(/candidate_detail.band/gi, candidate_detail.band);
    html = html.replace(/candidate_detail.sub_band/gi, candidate_detail.sub_band);
    html = html.replace(/candidate_detail.ctc/gi, candidate_detail.ctc);
    html = html.replace(/candidate_detail.basic_salary_0/gi, candidate_detail.basic_salary[0]);
    html = html.replace(/candidate_detail.basic_salary_1/gi, candidate_detail.basic_salary[1]);
    html = html.replace(/candidate_detail.basic_salary_2/gi, candidate_detail.basic_salary[2]);
    html = html.replace(/candidate_detail.hra_0/gi, candidate_detail.hra[0]);
    html = html.replace(/candidate_detail.hra_1/gi, candidate_detail.hra[1]);
    html = html.replace(/candidate_detail.hra_2/gi, candidate_detail.hra[2]);
    html = html.replace(/candidate_detail.flexi_benefit_plan_0/gi, candidate_detail.flexi_benefit_plan[0]);
    html = html.replace(/candidate_detail.flexi_benefit_plan_1/gi, candidate_detail.flexi_benefit_plan[1]);
    html = html.replace(/candidate_detail.flexi_benefit_plan_2/gi, candidate_detail.flexi_benefit_plan[2]);
    html = html.replace(/candidate_detail.pf_employer_contribution_0/gi, candidate_detail.pf_employer_contribution[0]);
    html = html.replace(/candidate_detail.pf_employer_contribution_1/gi, candidate_detail.pf_employer_contribution[1]);
    html = html.replace(/candidate_detail.pf_employer_contribution_2/gi, candidate_detail.pf_employer_contribution[2]);
    html = html.replace(/candidate_detail.esi_0/gi, candidate_detail.esi[0]);
    html = html.replace(/candidate_detail.esi_1/gi, candidate_detail.esi[1]);
    html = html.replace(/candidate_detail.esi_2/gi, candidate_detail.esi[2]);
    html = html.replace(/candidate_detail.total_a_0/gi, candidate_detail.total_a[0]);
    html = html.replace(/candidate_detail.total_a_1/gi, candidate_detail.total_a[1]);
    html = html.replace(/candidate_detail.total_a_2/gi, candidate_detail.total_a[2]);
    html = html.replace(/candidate_detail.variable_compensation_0/gi, candidate_detail.variable_compensation[0]);
    html = html.replace(/candidate_detail.variable_compensation_1/gi, candidate_detail.variable_compensation[1]);
    html = html.replace(/candidate_detail.variable_compensation_2/gi, candidate_detail.variable_compensation[2]);
    html = html.replace(/candidate_detail.gratuity/gi, candidate_detail.gratuity);
    html = html.replace(/candidate_detail.medical_insurance/gi, candidate_detail.medical_insurance);
    html = html.replace(/candidate_detail.total_c/gi, candidate_detail.total_c);

    pdf.create(html, options).toFile('./public/offer_letters/' + candidate_detail.first_name + '_' + new Date().getTime() + '.pdf', function (err, res1) {
        if (err) return console.log(err);
        return res.status(201).json({ message: "Offer Letter Generated Successfully", data: res1.filename.split("\\").pop() });
    });


    // try {
    //     try {
    //         var iof_detail = await EmployeeSkillMappingService.get_iof_detail(req.params.schedule_id)
    //         return res.status(201).json({ status: 201, data: iof_detail, message: "IOF Detail Succesfully" });
    //     } catch (e) {
    //         return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    //     }
    // } catch (e) {
    //     return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    // }
}
async function ctc_calculation(rrf_detail, other_detail) {
    var parent_band = other_detail.band.charAt(0)
    var ctc_configuration = await EmployeeSkillMappingService.get_ctc_configuration();
    ctc_configuration = ctc_configuration[0];
    var variable_pay = ctc_configuration["value"]["variable_pay"][parent_band];
    var gpa = ctc_configuration["value"]["gpa"][parent_band];
    //var =ctc_configuration["gpa"][parent_band];
    var result = { fixed_pay: 0, variable_pay: 0, gratuity: 0, insurance: 0, variable_percentage: variable_pay };
    other_detail["dependent_detail"].forEach(function (element) {
        for (let key of Object.keys(ctc_configuration["value"]["insurance_calculation"])) {
            if (element['age'] <= key) {
                if (parent_band == 'L') {
                    config_band = 'A'
                } else {
                    config_band = parent_band;
                }
                if (element['relation'] == 'Self') {
                    result['insurance'] += Number(gpa)
                    result['insurance'] += Number(ctc_configuration["value"]["insurance_calculation"][key][config_band]['employee'])
                } else {
                    result['insurance'] += Number(ctc_configuration["value"]["insurance_calculation"][key][config_band]['dependent'])

                }
                break
            }
        }
    });
    result['insurance'] += Math.round(result['insurance'] * 0.18);

    var a = other_detail["grand_ctc"] - result['insurance'];
    var b = 1 + Number(variable_pay / 100) + 0.01442307692307692;
    result['fixed_pay'] = Math.round(a / b);
    result['variable_pay'] = Math.round(result['fixed_pay'] * (Number(variable_pay) / 100));
    result['gratuity'] = Math.round(result['fixed_pay'] * 0.01442307692307692);
    return result;
}

exports.get_rrf_report_list = async function (req, res, next) {
    try {
        var condition = { $match: { $and: [{ deleted: false }] } }
        if (req.body.unit) {
            condition.$match.$and.push({ 'unit': req.body.unit });
        }
        if (req.body.practice) {
            condition.$match.$and.push({ 'practice': req.body.practice });
        }
        if (req.body.sub_practice) {
            condition.$match.$and.push({ 'sub_practice': req.body.sub_practice });
        }
        if (req.body.requested_by) {
            condition.$match.$and.push({ 'created_by': String(req.body.requested_by.id) });
        }
        if (req.body.status) {
            condition.$match.$and.push({ 'status': req.body.status });
        }
        if (req.body.from_date) {
            var to_date = req.body.to_date ? new Date(req.body.to_date) : new Date();
            condition.$match.$and.push({
                'created_on':
                {
                    $gte: new Date(req.body.from_date),
                    $lte: to_date
                }
            });
        }
        var isExport = req.body.export;
        var rrf_list = await EmployeeSkillMappingService.get_rrf_report_list(condition)
        var employee_ids = [];
        for (var object of rrf_list) {
            employee_ids.push(object.created_by);
        }
        getSelectedEmployeeList(employee_ids, function (error, employee_detail) {
            if (error)
                return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
            else {
                if (isExport) {
                    var report = exportRRFList(rrf_list, employee_detail);
                    return res.status(200).attachment('report.xlsx').send(report);
                } else {
                    return res.status(200).json({ status: 200, data: { rrf_list, employee_detail }, message: "RRF Report List Succesfully" });
                }
            }
        })

    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

function exportRRFList(rrf_list, employee_detail) {
    rrf_list.forEach(function (value, key) {
        rrf_list[key]["requested_by"] = employee_detail[value["created_by"]]["employee_name"]
        rrf_list[key]["created_on"] = moment(value["created_on"]).format('MMMM, DD YYYY')
        rrf_list[key]["no_of_candidate_uploaded"] = value["candidate_detail"].length
        rrf_list[key]["processing_candidate"] = value["candidate_detail"].length - (value["selected_candidate"] + value["rejected_candidate"])

    });
    const styles = {
        headerDark: {
            font: {
                bold: true,
            }
        },
    };

    const specification = {
        rrf_code: {
            displayName: 'RRF ID',
            headerStyle: styles.headerDark,
            width: 150
        },
        requested_by: {
            displayName: 'Requested By',
            headerStyle: styles.headerDark,
            width: 80
        },
        unit: {
            displayName: 'Unit',
            headerStyle: styles.headerDark,
            width: 80
        },
        role: {
            displayName: 'Role',
            headerStyle: styles.headerDark,
            width: 50
        },
        created_on: {
            displayName: 'Created On',
            headerStyle: styles.headerDark,
            width: 50
        },
        status: {
            displayName: 'Status',
            headerStyle: styles.headerDark,
            width: 150
        },
        no_of_position: {
            displayName: 'No Of Opening',
            headerStyle: styles.headerDark,
            width: 150
        },
        no_of_candidate_uploaded: {
            displayName: 'No of Candidate Uploaded',
            headerStyle: styles.headerDark,
            width: 100
        },
        selected_candidate: {
            displayName: 'No of Candidate Selected',
            headerStyle: styles.headerDark,
            width: 50
        },
        rejected_candidate: {
            displayName: 'No of Candidate Rejected',
            headerStyle: styles.headerDark,
            width: 50
        },
        processing_candidate: {
            displayName: 'No of Candidate Processing',
            headerStyle: styles.headerDark,
            width: 50
        }
    }


    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'Report', // <- Specify sheet name (optional)
                specification: specification, // <- Report specification
                data: rrf_list // <-- Report data
            }
        ]
    );
    return report;
}

exports.upload_candidate_document = async function (req, res, next) {
    var form = new formidable.IncomingForm()
    form.parse(req);
    var file_name = '';
    candidate_id = '';
    save_object = { payslips: [], bank_statement: [], degree_certificates: [], others: [], experience_letter: [], candidate_photo: [], cpif: [] };
    form.on('fileBegin', function (name, file) {
        file_name = name.split('[]')[0] + "_" + new Date().getTime() + "." + file.name.split('.').pop();
        file.path = path.join(__dirname, '..') + "\\public\\candidate_documents\\" + file_name;
        save_object[name.split('[]')[0]].push(file_name);
    })
    form.on('field', function (name, field) {
        candidate_id = field;
    })
    form.on('error', function (err) {
        res.status(500).json({ status: 200, message: "Error While Uploading File" });
    })
    form.on('end', function () {
        save_object["uploaded_on"] = new Date();
        EmployeeSkillMappingService.upload_candidate_document(candidate_id, save_object).
            then(candidate_object => {
                candidate_object ? res.status(201).json({ status: 201, data: candidate_object, message: "Candidate Document Uploaded Succesfully" }) : res.status(500).json({ status: 500, message: "Something Went Wrong" });
            })
            .catch(err => next(err));
    });
}

exports.check_candidate_document = async function (req, res, next) {
    try {
        try {
            var duplicate_check = await EmployeeSkillMappingService.check_candidate_document(req.body.candidate_id);
            return res.status(201).json({ status: 201, data: duplicate_check.length > 0 ? true : false, message: "Duplicate Check Succesfully" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.get_rrf_candidate_approve_list = async function (req, res, next) {
    try {
        try {
            var rrf_candidate_approve_list = await EmployeeSkillMappingService.rrf_candidate_approve_list(req.params.view_type);
            var employee_ids = [];
            for (var object of rrf_candidate_approve_list) {
                employee_ids.push(object.created_by);
            }
            getSelectedEmployeeList(employee_ids, function (error, employee_detail) {
                if (error)
                    return res.status(400).json({ status: 400, data: {}, message: "Something went wrong. Unable connect mysql webservices" })
                else
                    return res.status(201).json({ status: 201, data: { rrf_candidate_approve_list, employee_detail }, message: "RRF Candidate Approve List Succesfully" })
            })
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}

exports.save_rrf_candidate_approve = async function (req, res, next) {
    try {
        try {
            await EmployeeSkillMappingService.save_rrf_candidate_approve(req.params.candidate_id, req.params.status, req.params.approver_id)
            return res.status(201).json({ status: 201, message: "Candidate Status Updated" });
        } catch (e) {
            return res.status(400).json({ status: 400, message: "Something Went Wrong" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    }
}
exports.generate_indicative_offer_letter = async function (req, res, next) {
    const offer_letter_template = path.join(__dirname, '..') + "\\public\\indicative_offer_letter\\Indicative Offer Letter Template_M.htm";
    var html = fs.readFileSync(offer_letter_template, 'utf8');
    var options = { format: 'A4', "quality": "100" };
    var candidate_detail = {
        rrf_number: 'HTL/Mar19/Enabling Functions-Finance/93141 Test',
        generated_date: moment().format('MMMM, DD YYYY'),
        employee_title: "Mr",
        grand_ctc: "3,50,000",
        variable_percentage: "10",
        variable: "125000",
        fixed: "125000",
        address_line_1: "3/48 Thiruvalluvar Salai",
        address_line_2: "Ramapuram",
        address_line_3: "Chennai-89",
        first_name: "Gowdham",
        last_name: "K",
        designation: "Young Software Professional",
        base_location: "Chennai",
        joining_date: moment().format('MMMM, DD YYYY'),
        band: "A",
        sub_band: "AT2",
        basic_salary: ["7,598", "91,172", "30% of (A)"],
        hra: ["3,799", "45,586", "50% of Basic"],
        flexi_benefit_plan: ["12,129", "1,45,549", ""],
        pf_employer_contribution: ["1,800", "21,600", "12% of Basic"],
        esi: ["", "", ""],
        total_a: ["25,326", "3,03,906", ""],
        variable_compensation: ["3,039", "36,469", "12% of Fixed"],
        gratuity: "4,383",
        medical_insurance: "5,242",
        total_c: "9,625",
        ctc: "3,50,000",
    }
    html = html.replace(/candidate_detail.rrf_no/gi, candidate_detail.rrf_number);
    html = html.replace(/candidate_detail.generated_date/gi, candidate_detail.generated_date);
    html = html.replace(/candidate_detail.employee_title/gi, candidate_detail.employee_title);
    html = html.replace(/candidate_detail.address_line_1/gi, candidate_detail.address_line_1);
    html = html.replace(/candidate_detail.address_line_2/gi, candidate_detail.address_line_2);
    html = html.replace(/candidate_detail.address_line_3/gi, candidate_detail.address_line_3);
    html = html.replace(/candidate_detail.first_name/gi, candidate_detail.first_name);
    html = html.replace(/candidate_detail.last_name/gi, candidate_detail.last_name);
    html = html.replace(/candidate_detail.designation/gi, candidate_detail.designation);
    html = html.replace(/candidate_detail.base_location/gi, candidate_detail.base_location);
    html = html.replace(/candidate_detail.joining_date/gi, candidate_detail.joining_date);
    html = html.replace(/candidate_detail.band/gi, candidate_detail.band);
    html = html.replace(/candidate_detail.sub_band/gi, candidate_detail.sub_band);
    html = html.replace(/candidate_detail.ctc/gi, candidate_detail.ctc);
    html = html.replace(/candidate_detail.basic_salary_0/gi, candidate_detail.basic_salary[0]);
    html = html.replace(/candidate_detail.basic_salary_1/gi, candidate_detail.basic_salary[1]);
    html = html.replace(/candidate_detail.basic_salary_2/gi, candidate_detail.basic_salary[2]);
    html = html.replace(/candidate_detail.hra_0/gi, candidate_detail.hra[0]);
    html = html.replace(/candidate_detail.hra_1/gi, candidate_detail.hra[1]);
    html = html.replace(/candidate_detail.hra_2/gi, candidate_detail.hra[2]);
    html = html.replace(/candidate_detail.flexi_benefit_plan_0/gi, candidate_detail.flexi_benefit_plan[0]);
    html = html.replace(/candidate_detail.flexi_benefit_plan_1/gi, candidate_detail.flexi_benefit_plan[1]);
    html = html.replace(/candidate_detail.flexi_benefit_plan_2/gi, candidate_detail.flexi_benefit_plan[2]);
    html = html.replace(/candidate_detail.pf_employer_contribution_0/gi, candidate_detail.pf_employer_contribution[0]);
    html = html.replace(/candidate_detail.pf_employer_contribution_1/gi, candidate_detail.pf_employer_contribution[1]);
    html = html.replace(/candidate_detail.pf_employer_contribution_2/gi, candidate_detail.pf_employer_contribution[2]);
    html = html.replace(/candidate_detail.esi_0/gi, candidate_detail.esi[0]);
    html = html.replace(/candidate_detail.esi_1/gi, candidate_detail.esi[1]);
    html = html.replace(/candidate_detail.esi_2/gi, candidate_detail.esi[2]);
    html = html.replace(/candidate_detail.total_a_0/gi, candidate_detail.total_a[0]);
    html = html.replace(/candidate_detail.total_a_1/gi, candidate_detail.total_a[1]);
    html = html.replace(/candidate_detail.total_a_2/gi, candidate_detail.total_a[2]);
    html = html.replace(/candidate_detail.variable_compensation_0/gi, candidate_detail.variable_compensation[0]);
    html = html.replace(/candidate_detail.variable_compensation_1/gi, candidate_detail.variable_compensation[1]);
    html = html.replace(/candidate_detail.variable_compensation_2/gi, candidate_detail.variable_compensation[2]);
    html = html.replace(/candidate_detail.gratuity/gi, candidate_detail.gratuity);
    html = html.replace(/candidate_detail.medical_insurance/gi, candidate_detail.medical_insurance);
    html = html.replace(/candidate_detail.total_c/gi, candidate_detail.total_c);
    html = html.replace(/candidate_detail.grand_ctc/gi, candidate_detail.grand_ctc);
    html = html.replace(/candidate_detail.variable_percentage/gi, candidate_detail.variable_percentage);
    html = html.replace(/candidate_detail.variable/gi, candidate_detail.variable);
    html = html.replace(/candidate_detail.fixed/gi, candidate_detail.fixed);

    pdf.create(html, options).toFile('./public/indicative_offer_letter/' + candidate_detail.first_name + '_' + new Date().getTime() + '.pdf', function (err, res1) {
        if (err) return console.log(err);
        console.log(res1); // { filename: '/app/businesscard.pdf' }
        return res.status(201).json({ message: "Indicative Offer Letter Generated Successfully" });
    });


    // try {
    //     try {
    //         var iof_detail = await EmployeeSkillMappingService.get_iof_detail(req.params.schedule_id)
    //         return res.status(201).json({ status: 201, data: iof_detail, message: "IOF Detail Succesfully" });
    //     } catch (e) {
    //         return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    //     }
    // } catch (e) {
    //     return res.status(400).json({ status: 400, message: "Something Went Wrong" });
    // }
}


exports.get_organization_skill_list = async function (req, res, next) {
    try {
        var condition = { $match: { $and: [{ deleted: "0" }] } }
        if (req.body.unit) {
            condition.$match.$and.push({ 'company_structure_unit.id': req.body.unit });
        }
        if (req.body.practice) {
            condition.$match.$and.push({ 'company_structure_practice.id': req.body.practice });
        }
        if (req.body.sub_practice) {
            condition.$match.$and.push({ 'company_structure_sub_practice.id': req.body.sub_practice });
        }

        var organization_skill_list = await EmployeeSkillMappingService.get_organization_skill_list(condition)

        return res.status(200).json({ status: 200, data: organization_skill_list, message: "Organization Skill List Succesfully" });

    } catch (e) {
        return res.status(400).json({ status: 400, message: "Something Went Wrong" });
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
function getEmployeeBandAndUnitDetail(employee_id, callback) {
    var return_data;
    console.log("Inside" + employee_id);
    var reqGet = http.request(config.webservice_url + "getEmployeeBandAndUnitDetail/" + employee_id, function (res) {
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
            .on('error', function (error) {
                callback(error, null)

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
function getSelectedEmployeeList(employee_ids, callback) {
    var return_data;
    var data = JSON.stringify(employee_ids);
    if (employee_ids.length > 0) {
        var reqGet = http.request(config.webservice_url + "getSelectedEmployeeList/", {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            }
        }, function (res) {
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
        reqGet.write(data)
        reqGet.end();
        reqGet.on('error', function (e) {
            console.log("Why me?5");
            console.log("inside error");
            console.error(e);
        });
    } else {
        callback(null, []);
    }

}
function getFliteredEmployeeList(filtered_value, callback) {
    var return_data;
    var reqGet = http.request(config.webservice_url + "getFliteredEmployeeList/" + filtered_value, function (res) {
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
        console.error(e);
    });
}
function geRRFCreationDetail(callback) {
    var reqGet = http.request(config.webservice_url + "geRRFCreationDetail/", function (res) {
        var buffers = [];
        res.on('data', function (chunk) {
            buffers.push(chunk)

        }).on('end', function (data) {
            try {
                return_data = JSON.parse(Buffer.concat(buffers).toString());
                return callback(null, return_data);
            } catch (err) {
                console.error(err)
            }
        });
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });

}

function getProject(customer_id, callback) {
    var reqGet = http.request(config.webservice_url + "getProject/" + customer_id, function (res) {
        var buffers = [];
        res.on('data', function (chunk) {
            buffers.push(chunk)

        }).on('end', function (data) {
            try {
                return_data = JSON.parse(Buffer.concat(buffers).toString());
                return callback(null, return_data);
            } catch (err) {
                console.error(err)
            }
        });
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });

}

function getSubWorkLocations(location_name, callback) {
    var reqGet = http.request(config.webservice_url + "getSubWorkLocations/" + location_name, function (res) {
        var buffers = [];
        res.on('data', function (chunk) {
            buffers.push(chunk)

        }).on('end', function (data) {
            try {
                return_data = JSON.parse(Buffer.concat(buffers).toString());
                return callback(null, return_data);
            } catch (err) {
                console.error(err)
            }
        });
    });
    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });

}
function getRrfDetail(rrf_detail, callback) {
    var return_data;
    var data = JSON.stringify(rrf_detail);
    var reqGet = http.request(config.webservice_url + "getRrfDetail/", {
        method: "POST", headers: {
            'Content-Type': 'application/json',
        }
    }, function (res) {
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
    reqGet.write(data)
    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });
}

function getRRFEditData(rrf_detail, callback) {
    var return_data;
    var data = JSON.stringify(rrf_detail);
    var reqGet = http.request(config.webservice_url + "getRRFEditData/", {
        method: "POST", headers: {
            'Content-Type': 'application/json',
        }
    }, function (res) {
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
    reqGet.write(data)
    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });
}




