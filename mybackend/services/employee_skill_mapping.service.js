// Gettign the Newly created Mongoose Model we just created 
var CompanyStructure = require('../models/company_structure.model');
var CompetencySkillMapping = require('../models/competency_skill_mappings.model');
var CompetencyStructureMapping = require('../models/competency_structure_mappings.model');
var EmployeeSkillSet = require('../models/employee_skill_sets.model')
var EmployeeCompetencyMaster = require('../models/employee_competency_master.model');
var ProficiencyName = require('../models/proficiency_names.model');
var JobMaster = require('../models/job_masters.model');
var SkillMaster = require('../models/skill_masters.model');
var FixedCompetency = require('../models/fixed_competencies.model');
var JobPost = require('../models/job_posts.model');
var RrfMaster = require('../models/rrf_master.model');
var CandidateDetail = require('../models/candidate_detail.model');
var ConfigurationValue = require("../models/configuration_values.models");
ObjectId = require('mongoose').Types.ObjectId;
exports.get_units = async function (parent_id) {

    return await CompanyStructure.aggregate([

        {
            $match: {
                "parent_id": parent_id
            }
        },

        {
            $project: {
                "_id": 0,
                "id": 1,
                "name": 1
            }
        }
    ]);
}
exports.get_competency = async function (sub_sbu_id, selected_competency) {
    return await CompetencyStructureMapping.aggregate([

        {
            $match: {
                "id": { $nin: selected_competency },
                "sub_sbu_id": sub_sbu_id,
                "deleted": "0"
            }
        },
        {
            $lookup:
            {
                from: "competency_masters",
                localField: "competency_master_id",
                foreignField: "id",
                as: "competency_master"
            }
        },
        {
            $project: {
                "_id": 0,
                "id": "$competency_master.id",
                "name": "$competency_master.competency_name"
            }
        }
    ]);
}

exports.get_skill = async function (com_str_map_id, selected_skill) {
    return await CompetencySkillMapping.aggregate([

        {
            $match: {
                "id": { $nin: selected_skill },
                "competency_master_id": com_str_map_id,
                "deleted": "0"
            }
        },
        {
            $lookup:
            {
                from: "skill_masters",
                localField: "skill_master_id",
                foreignField: "id",
                as: "skill_master"
            }
        },
        {
            $project: {
                "_id": 0,
                "id": 1,
                "name": "$skill_master.skill_name"
            }
        }
    ]);
}


exports.save_competency_mapping = async function (save_data) {
    var save_object = { "employee_id": save_data.employee_id, "status": "m", "created_on": new Date() };
    const check_exist = await EmployeeCompetencyMaster.findOne({ "employee_id": save_data.employee_id, "deleted": false }, { _id: 1 });
    if (check_exist) {
        await EmployeeCompetencyMaster.findByIdAndUpdate(check_exist._id, { $set: { "status": "m" } }, { upsert: true }, function (err) {
            if (err) {
                console.log(err);
            }
        });
        var ess_save_data = { "employee_competency_master_id": check_exist._id }
    } else {
        const ecm_save_object = new EmployeeCompetencyMaster(save_object);
        await ecm_save_object.save();
        var ess_save_data = { "employee_competency_master_id": ecm_save_object._id }
        var ess_fixed_save_data = { "employee_competency_master_id": ecm_save_object._id }
    }
    var ess_save_object;
    var ess_update_data = {};
    for (var mapping_id in save_data.updated_data) {
        ess_update_data["experience_month"] = save_data.updated_data[mapping_id]["experience"];
        ess_update_data["gap"] = save_data.updated_data[mapping_id]["gap"];
        var experience_array = await get_proficiency(save_data.updated_data[mapping_id]["skill_id"])
        inner_loop: for (var index in experience_array[0].experience_month) {
            if (parseInt(save_data.updated_data[mapping_id]["experience"]) < parseInt(experience_array[0].experience_month[index])) {
                // var experience_array_index = index;
                // if (save_data.updated_data[mapping_id]["gap"] == "yes" && index != 0) {
                //     experience_array_index = index - 1;
                // }
                ess_update_data["employee_proficiency"] = experience_array[0].name[index];
                ess_update_data["manager_proficiency"] = "";
                ess_update_data["status"] = "m";
                ess_update_data["modified_on"] = new Date();
                await EmployeeSkillSet.findByIdAndUpdate(mapping_id, { $set: ess_update_data }, { upsert: true }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                break inner_loop;
            }
        }
    }

    for (var key in save_data.data) {
        if (parseInt(save_data.data[key]["experience"]) > 0) {
            ess_save_data["competency_skill_mapping_id"] = save_data.data[key]["skill_id"];
            ess_save_data["experience_month"] = save_data.data[key]["experience"];
            ess_save_data["gap"] = save_data.data[key]["gap"];
            ess_save_data["sub_sbu_id"] = save_data.data[key]["sub_sbu_id"];
            var experience_array = await get_proficiency(save_data.data[key]["skill_id"])
            inner_loop: for (var index in experience_array[0].experience_month) {
                if (parseInt(save_data.data[key]["experience"]) < parseInt(experience_array[0].experience_month[index])) {
                    // var experience_array_index = index;
                    // if (save_data.data[key]["gap"] == "yes" && index != 0) {
                    //     experience_array_index = index - 1;
                    // }
                    ess_save_data["employee_proficiency"] = experience_array[0].name[index];
                    ess_save_data["status"] = "m";
                    ess_save_data["modified_on"] = new Date();
                    ess_save_object = new EmployeeSkillSet(ess_save_data);
                    await ess_save_object.save();
                    break inner_loop;
                }
            }
        }

    }

    //For Fixed Competency
    if (!check_exist) {
        var fixed_competency_detail = await FixedCompetency.aggregate([
            {
                '$match': {
                    'band_name': save_data.band_name
                }
            }, {
                '$lookup': {
                    'from': 'competency_skill_mappings',
                    'let': {
                        'competency_master_id': '$competency_master_id',
                        'skill_master_id': '$skill_master_id',
                        'competency_id': '$competency_id',
                        'skill_id': '$skill_id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$$competency_id', '$competency_master_id'
                                            ]
                                        }, {
                                            '$eq': [
                                                '$$skill_id', '$skill_master_id'
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'competency_skill_mapping'
                }
            }, {
                '$unwind': {
                    'path': '$competency_skill_mapping'
                }
            }, {
                '$project': {
                    '_id': 0,
                    'competency_skill_mapping_id': '$competency_skill_mapping.id',
                    'proficiency_id': 1
                }
            }
        ]);
        for (var value of fixed_competency_detail) {
            ess_fixed_save_data["competency_skill_mapping_id"] = value["competency_skill_mapping_id"];
            ess_fixed_save_data["employee_proficiency"] = value["proficiency_id"];
            ess_fixed_save_data["status"] = "m";
            ess_fixed_save_data["modified_on"] = new Date();
            ess_fixed_save_object = new EmployeeSkillSet(ess_fixed_save_data);

            await ess_fixed_save_object.save();
        }

    }
}

exports.get_competency_mapping = async function (condition) {
    return await EmployeeCompetencyMaster.aggregate(

        [
            {
                $lookup: {
                    from: "employee_skill_sets",
                    localField: "_id",
                    foreignField: "employee_competency_master_id",
                    as: "employee_skill_set"
                }
            },
            {
                $unwind: {
                    path: "$employee_skill_set"
                }
            },
            {
                $lookup: {
                    from: "proficiency_names",
                    localField: "employee_skill_set.employee_proficiency",
                    foreignField: "id",
                    as: "employee_proficiency"
                }
            },
            {
                $unwind: {
                    path: "$employee_proficiency"
                }
            },
            {
                $lookup: {
                    from: "proficiency_names",
                    localField: "employee_skill_set.manager_proficiency",
                    foreignField: "id",
                    as: "manager_proficiency"
                }
            },
            {
                $unwind: {
                    path: "$manager_proficiency",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "competency_skill_mappings",
                    localField: "employee_skill_set.competency_skill_mapping_id",
                    foreignField: "id",
                    as: "competency_skill_mapping"
                }
            },
            {
                $unwind: {
                    path: "$competency_skill_mapping"
                }
            },
            {
                $lookup: {
                    from: "skill_masters",
                    localField: "competency_skill_mapping.skill_master_id",
                    foreignField: "id",
                    as: "skill_master"
                }
            },
            {
                $unwind: {
                    path: "$skill_master"
                }
            },
            {
                $lookup: {
                    from: "competency_masters",
                    localField: "competency_skill_mapping.competency_master_id",
                    foreignField: "id",
                    as: "competency_master"
                }
            },
            {
                $unwind: {
                    path: "$competency_master"
                }
            },
            {
                $lookup: {
                    from: "company_structures",
                    localField: "employee_skill_set.sub_sbu_id",
                    foreignField: "id",
                    as: "company_structure"
                }
            },
            {
                $unwind: {
                    path: "$company_structure",
                    preserveNullAndEmptyArrays: true
                }
            },
            condition,
            {
                $project: {
                    "_id": 1,
                    "current_role": 1,
                    "strucure": "$company_structure.name",
                    "competency_name": "$competency_master.competency_name",
                    "skill_name": "$skill_master.skill_name",
                    "experience_month": "$employee_skill_set.experience_month",
                    "gap": "$employee_skill_set.gap",
                    "employee_proficiency": "$employee_proficiency.proficiency_name",
                    "employee_proficiency_id": "$employee_proficiency.id",
                    "manager_proficiency": "$manager_proficiency.proficiency_name",
                    "employee_skill_set_id": "$employee_skill_set._id",
                    "skill_id": "$competency_skill_mapping.id",
                    "mapping_id": "$competency_skill_mapping.id",
                    "skill_array": "$skill_master.skill_array",
                }
            }
        ]
    );
}

exports.get_proficiency = async function () {
    return await ProficiencyName.aggregate([

        {
            $match: {
                "deleted": "0"
            }
        },
        {
            $project: {
                "_id": 0,
                "id": 1,
                "proficiency_name": 1
            }
        }
    ]);
}
exports.save_manger_proficiency = async function (save_data, employee_id, manager_id, current_role) {
    await EmployeeCompetencyMaster.updateMany(
        { "employee_id": employee_id },
        {
            $set: {
                "status": "a",
                "approved_by": manager_id,
                "approved_on": new Date(),
                "current_role": current_role
            }
        }
    )
    for (var key in save_data) {
        await EmployeeSkillSet.findByIdAndUpdate(key, { $set: { "manager_proficiency": save_data[key], "status": "a" } }, { upsert: true }, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.get_roles = async function (unit_id, band_name) {
    return await JobMaster.aggregate([

        {
            $match: {
                "band_name": band_name,
                "unit_id": unit_id,
                "deleted": "0"
            }
        },
        {
            $project: {
                "_id": 0,
                "role": 1,
                "id": 1
            }
        }
    ]);
}
exports.get_job_codes = async function (role, band) {
    return await JobMaster.aggregate([

        {
            $match: {
                "role": role,
                "band_name": band,
                "deleted": "0"
            }
        },
        {
            $project: {
                "_id": 0,
                "id": 1,
                "job_code": 1
            }
        }
    ]);
}

async function get_proficiency(mapping_id) {

    return await CompetencySkillMapping.aggregate([
        {
            $match: {
                "id": mapping_id,
                "deleted": "0"
            }
        },
        {
            $lookup:
            {
                from: "proficiency_skills",
                localField: "proficiency_masters_id",
                foreignField: "proficiency_master_id",
                as: "proficiency_skill"
            }
        },
        {
            $lookup:
            {
                from: "proficiency_names",
                localField: "proficiency_skill.proficiency_name_id",
                foreignField: "id",
                as: "proficiency_name"
            }
        },
        {
            $project: {
                "_id": 0,
                "name": "$proficiency_name.id",
                "proficiency_name": "$proficiency_name.proficiency_name",
                "experience_month": "$proficiency_skill.experience"
            }
        },
        {
            $sort: {
                "proficiency_name.proficiency_order": 1
            }
        }

    ]);

}

exports.get_employee_mapping_list = async function (employees_id) {
    return await EmployeeCompetencyMaster.aggregate([

        {
            $match: {
                "employee_id": { $in: employees_id },
                "deleted": false
            }
        },
        {
            $project: {
                "_id": 0,
                "created_on": 1,
                "status": 1,
                "employee_id": 1
            }
        }
    ]);
}

exports.get_job_detail = async function (job_master_id, job_post_id) {
    var condition = { $match: { $and: [{ deleted: "0" }, { 'id': job_master_id }] } }
    if (job_post_id) {
        var disselected_job_competency_ids = await JobPost.aggregate([
            {
                $match: {
                    "deleted": false,
                    "_id": ObjectId(job_post_id)
                }
            },
            {
                $project: {
                    "_id": 0,
                    "disselected_job_competency": 1,
                }
            }
        ]);
        var not_in_ids = [];
        if (disselected_job_competency_ids) {
            disselected_job_competency_ids[0].disselected_job_competency.forEach(value => {
                not_in_ids.push(ObjectId(value));
            });
        }
        condition.$match.$and.push({ 'job_competency_mapping._id': { $nin: not_in_ids } });
    }
    return await JobMaster.aggregate(
        [
            {
                $lookup: {
                    from: "job_competency_mappings",
                    localField: "id",
                    foreignField: "job_master_id",
                    as: "job_competency_mapping"
                }
            },
            {
                $unwind: {
                    path: "$job_competency_mapping",
                }
            },
            condition,
            {
                $lookup: {
                    from: 'competency_dictionary',
                    let: {
                        competency_master_id: "$competency_master_id",
                        proficiency_id: "$proficiency_id",
                        job_competency_master_id: "$job_competency_mapping.competency_master_id",
                        job_competency_proficiecny: "$job_competency_mapping.competency_proficiency"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$$job_competency_master_id", "$competency_master_id"
                                            ]
                                        }, {
                                            $eq: [
                                                "$$job_competency_proficiecny", "$proficiency_id"
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'competency_dictionary'
                }
            }, {
                $unwind: {
                    path: "$competency_dictionary",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "competency_masters",
                    localField: "job_competency_mapping.competency_master_id",
                    foreignField: "id",
                    as: "competency_master"
                }
            },
            {
                $unwind: {
                    path: "$competency_master"
                }
            },
            {
                $lookup: {
                    from: "skill_masters",
                    localField: "job_competency_mapping.skill_master_id",
                    foreignField: "id",
                    as: "skill_master"
                }
            },
            {
                $unwind: {
                    path: "$skill_master"
                }
            },
            {
                $lookup:
                {
                    from: "proficiency_names",
                    localField: "job_competency_mapping.skill_proficiency",
                    foreignField: "id",
                    as: "proficiency_name"
                }
            },
            {
                $unwind: {
                    path: "$proficiency_name"
                }
            },
            {
                $lookup:
                {
                    from: "proficiency_names",
                    localField: "job_competency_mapping.competency_proficiency",
                    foreignField: "id",
                    as: "competency_proficiency_name"
                }
            },
            {
                $unwind: {
                    path: "$competency_proficiency_name"
                }
            },
            {
                $project: {
                    "_id": 0,
                    "competency_name": "$competency_master.competency_name",
                    "competency_id": "$competency_master.id",
                    "competency_proficiency_name": "$competency_proficiency_name.proficiency_name",
                    "skill_name": "$skill_master.skill_name",
                    "skill_id": "$skill_master.id",
                    "skill_proficiency_name": "$proficiency_name.proficiency_name",
                    "competency_definition": "$competency_dictionary.definition",
                    "competency_proficiency_description": "$competency_dictionary.description",
                    "skill_proficiency": "$proficiency_name.proficiency_order",
                    "job_competency_id": "$job_competency_mapping._id",
                    "fixed_competency_flag": "$competency_master.fixed",
                    "skill_array": "$skill_master.skill_array"
                }
            }
        ]
    );
}

exports.get_employee_mapping_detail = async function (employee_id) {
    return await EmployeeCompetencyMaster.aggregate(

        [

            {
                $lookup: {
                    from: "employee_skill_sets",
                    localField: "_id",
                    foreignField: "employee_competency_master_id",
                    as: "employee_skill_set"
                }
            },
            {
                $unwind: {
                    path: "$employee_skill_set"
                }
            },
            {
                $match: {
                    $and: [
                        { "deleted": false },
                        { 'employee_id': employee_id },
                        { "employee_skill_set.status": "a" }
                    ]
                }
            },
            {
                $lookup: {
                    from: "proficiency_names",
                    localField: "employee_skill_set.manager_proficiency",
                    foreignField: "id",
                    as: "manager_proficiency"
                }
            },
            {
                $unwind: {
                    path: "$manager_proficiency",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "competency_skill_mappings",
                    localField: "employee_skill_set.competency_skill_mapping_id",
                    foreignField: "id",
                    as: "competency_skill_mapping"
                }
            },
            {
                $unwind: {
                    path: "$competency_skill_mapping"
                }
            },
            {
                $lookup: {
                    from: "skill_masters",
                    localField: "competency_skill_mapping.skill_master_id",
                    foreignField: "id",
                    as: "skill_master"
                }
            },
            {
                $unwind: {
                    path: "$skill_master"
                }
            },
            {
                $lookup: {
                    from: "competency_masters",
                    localField: "competency_skill_mapping.competency_master_id",
                    foreignField: "id",
                    as: "competency_master"
                }
            },
            {
                $unwind: {
                    path: "$competency_master"
                }
            },
            {
                $project: {
                    "_id": 0,
                    "competency_id": "$competency_skill_mapping.competency_master_id",
                    "skill_id": "$competency_skill_mapping.skill_master_id",
                    "manager_proficiency": "$manager_proficiency.proficiency_order",
                    "manager_proficiency_name": "$manager_proficiency.proficiency_name",
                }
            }
        ]
    );
}
exports.get_proficiency_list = async function (mapping_id) {
    return await CompetencySkillMapping.aggregate([
        {
            $match: {
                "id": mapping_id,
                "deleted": "0"
            }
        },
        {
            $lookup:
            {
                from: "proficiency_skills",
                localField: "proficiency_masters_id",
                foreignField: "proficiency_master_id",
                as: "proficiency_skill"
            }
        },
        {
            $unwind: {
                path: "$proficiency_skill"
            }
        },
        {
            $lookup:
            {
                from: "proficiency_names",
                localField: "proficiency_skill.proficiency_name_id",
                foreignField: "id",
                as: "proficiency_name"
            }
        },
        {
            $unwind: {
                path: "$proficiency_name"
            }
        },
        {
            $project: {
                "_id": 0,
                "name": "$proficiency_name.id",
                "proficiency_name": "$proficiency_name.proficiency_name",
                "experience_month": "$proficiency_skill.experience"
            }
        },
        {
            $sort: {
                "proficiency_name.proficiency_order": 1
            }
        }

    ]);
}
exports.get_skill_list = async function () {
    return await SkillMaster.aggregate([
        {
            $match: {
                "deleted": "0"
            }
        },
        {
            $project: {
                "_id": 0,
                "skill_id": "$id",
                "skill_name": "$skill_name",
            }
        },
    ]);
}

exports.get_filtered_employee_mapping_list = async function (condition) {
    return await EmployeeCompetencyMaster.aggregate(
        [
            {
                '$lookup': {
                    'from': 'employee_skill_sets',
                    'localField': '_id',
                    'foreignField': 'employee_competency_master_id',
                    'as': 'employee_skill_set'
                }
            }, {
                '$lookup': {
                    'from': 'competency_skill_mappings',
                    'localField': 'employee_skill_set.competency_skill_mapping_id',
                    'foreignField': 'id',
                    'as': 'competency_skill_mapping'
                }
            }, {
                '$addFields': {
                    'merged_object': {
                        '$map': {
                            'input': '$employee_skill_set',
                            'in': {
                                '$mergeObjects': [
                                    '$$this', {
                                        '$arrayElemAt': [
                                            '$competency_skill_mapping', {
                                                '$indexOfArray': [
                                                    '$competency_skill_mapping.id', '$$this.competency_skill_mapping_id'
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            condition
            , {
                '$project': {
                    '_id': 0,
                    'created_on': 1,
                    'status': 1,
                    'employee_id': 1
                }
            }
        ]
    );
}

exports.get_role = async function (employee_detail) {
    return await JobMaster.aggregate([

        {
            $match: {
                "deleted": "0",
                "band_name": employee_detail.band_name,
                "unit_id": employee_detail.unit_id
            }
        },
        {
            $project: {
                "_id": 0,
                "role": 1
            }
        }
    ]);
}
exports.get_role_list = async function (condition) {
    return await JobMaster.aggregate([

        condition,
        {
            $project: {
                "_id": 0,
                "role": 1
            }
        },
        { $limit: 15 }
    ]);
}


exports.create_new_internal_job = async function (save_data, created_by) {
    if (!save_data.min_fitment_score)
        save_data.min_fitment_score = "0";
    var save_object = { "active": true, "created_by": created_by, "status": "Open", "created_on": new Date(), "job_code_id": save_data.job_code, "disselected_job_competency": save_data.disseleceted_job_detail_object, "min_fitment_score": save_data.min_fitment_score, "job_location": save_data.job_location, "job_post_end_date": save_data.job_post_end_date };
    job_post_save_object = new JobPost(save_object);
    return job_post_save_object.save();

}

exports.get_internal_job = async function () {
    return await JobPost.aggregate([
        {
            $match: {
                "deleted": false,
                // "active": true
            }
        },
        {
            '$lookup': {
                'from': 'job_masters',
                'localField': 'job_code_id',
                'foreignField': 'id',
                'as': 'job_master'
            }
        },
        {
            $unwind: {
                path: "$job_master"
            }
        },
        {
            $lookup: {
                from: "company_structures",
                localField: "job_master.unit_id",
                foreignField: "id",
                as: "company_structure"
            }
        },
        {
            $unwind: {
                path: "$company_structure"
            }
        },
        {
            $project: {
                "_id": 1,
                "role": "$job_master.role",
                "band_name": "$job_master.band_name",
                "unit_name": "$company_structure.name",
                "created_by": "$created_by",
                "status": "$status",
                "created_on": "$created_on",
            }
        },

    ]);
}

exports.get_internal_job_detail = async function (job_id) {
    var job_post_detail = await JobPost.aggregate([
        {
            $match: {
                "deleted": false,
                "_id": ObjectId(job_id)
            }
        },
        {
            '$lookup': {
                'from': 'job_masters',
                'localField': 'job_code_id',
                'foreignField': 'id',
                'as': 'job_master'
            }
        },
        {
            $unwind: {
                path: "$job_master"
            }
        },
        {
            $lookup: {
                from: "company_structures",
                localField: "job_master.unit_id",
                foreignField: "id",
                as: "company_structure"
            }
        },
        {
            $unwind: {
                path: "$company_structure"
            }
        },
        {
            $project: {
                "_id": 1,
                "role": "$job_master.role",
                "band_name": "$job_master.band_name",
                "job_code": "$job_master.job_code",
                "job_master_id": "$job_master.id",
                "unit_name": "$company_structure.name",
                "created_by": "$created_by",
                "status": "$status",
                "min_fitment_score": "$min_fitment_score",
                "job_location": "$job_location",
                "job_post_end_date": "$job_post_end_date",
                "created_on": "$created_on",
                "applied_employees": "$applied_employees"
            }
        },

    ]);
    var job_detail = await this.get_job_detail(job_post_detail[0].job_master_id, job_id);
    return { job_detail, job_post_detail }
}

exports.update_internal_job_detail = async function (job_post_id, status, employee_status_detail) {
    await JobPost.findByIdAndUpdate(job_post_id, { $set: { "status": status } }, { upsert: true }, function (err) {
        if (err) {
            console.log(err);
        }
    });
    for (var i = 0; i < employee_status_detail.length; i++) {
        var employee_id_status = employee_status_detail[i];
        var update_detail = employee_id_status.split('_');
        await JobPost.update({ "_id": ObjectId(job_post_id), "applied_employees.employee_id": update_detail[0] }, {
            $set: {
                "applied_employees.$.status": update_detail[1]
            }
        }, { upsert: true }, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

}


exports.get_open_internal_jobs = async function () {
    return await JobPost.aggregate([
        {
            $match: {
                "deleted": false,
                // "active": true,
                "job_post_end_date": {
                    '$gte': new Date()
                },
                "status": "Open"
            }
        },
        {
            '$lookup': {
                'from': 'job_masters',
                'localField': 'job_code_id',
                'foreignField': 'id',
                'as': 'job_master'
            }
        },
        {
            $unwind: {
                path: "$job_master"
            }
        },
        {
            $project: {
                "_id": 1,
                "role": "$job_master.role",
                "id": "$job_master.id",
                "created_on": "$created_on",
            }
        },

    ])
        .sort({ created_on: 'desc' });
}


exports.apply_job = async function (job_post_id, employee_id, manager_agreed) {

    return await JobPost.findByIdAndUpdate(job_post_id, {
        $push: {
            applied_employees: {
                "employee_id": employee_id,
                "manager_agreed": manager_agreed,
                "applied_on": new Date(),
                "status": "Applied"
            }
        }
    }, { upsert: true }, function (err) {
        if (err) {
            console.log(err);
        }
    });

}

exports.check_apply_job = async function (job_post_id, employee_id, fitment_score) {
    var already_applied_flag = await JobPost.find({ deleted: false, "_id": ObjectId(job_post_id), 'applied_employees.employee_id': employee_id });
    var min_fitment_score_flag = await JobPost.find({ deleted: false, "_id": ObjectId(job_post_id), 'min_fitment_score': { $gte: fitment_score } });;

    return { already_applied_flag, min_fitment_score_flag }
}


exports.get_applied_job_post = async function (employee_id) {
    return await JobPost.aggregate([
        {
            $match: {
                "deleted": false,
                "applied_employees.employee_id": employee_id
            }
        },
        {
            '$lookup': {
                'from': 'job_masters',
                'localField': 'job_code_id',
                'foreignField': 'id',
                'as': 'job_master'
            }
        },
        {
            $unwind: {
                path: "$job_master"
            }
        },
        {
            $project: {
                "_id": 1,
                "role": "$job_master.role",
                "id": "$job_master.id",
                "applied_on": {
                    $filter: {
                        input: "$applied_employees",
                        as: "applied_employee",
                        cond: { $eq: ["$$applied_employee.employee_id", employee_id] }
                    }
                }
            }
        },

    ]);
}

exports.create_new_rrf = async function (save_data, created_by) {
    console.log(save_data)
    if (!save_data.minimum_fitment_score)
        save_data.minimum_fitment_score = "0";
    save_data["created_by"] = created_by;
    save_data["status"] = "Submitted";
    var rrf_save_object = new RrfMaster(save_data);
    var save_object = { "created_by": created_by, "rrf_master_id": rrf_save_object._id, "status": "Open", "active": false, "created_on": new Date(), "job_code_id": save_data.job_code, "disselected_job_competency": save_data.disselected_job_competency, "min_fitment_score": save_data.minimum_fitment_score, "job_location": save_data.work_location };
    job_post_save_object = new JobPost(save_object);
    if (job_post_save_object.save() && rrf_save_object.save())
        return true;
}
exports.update_rrf = async function (save_data, created_by) {
    save_data["status"] = "Submitted";
    await RrfMaster.findByIdAndUpdate(save_data.rrf_id, { $set: save_data }, { upsert: true }, function (err) {
        if (err) {
            console.log(err);
        }
    });
    return true;
}

exports.get_rrf_list = async function (condition) {

    return await RrfMaster.aggregate([
        condition,
        {
            $lookup: {
                from: "company_structures",
                localField: "unit",
                foreignField: "id",
                as: "company_structure"
            }
        },
        {
            $unwind: {
                path: "$company_structure"
            }
        },
        {
            $project: {
                "_id": 1,
                "rrf_code": 1,
                "created_on": 1,
                "created_by": 1,
                "role": 1,
                "status": 1,
                "band": 1,
                "unit": "$company_structure.name",
                "rrf_code": 1,
            }
        }
    ]);
}

exports.get_rrf_detail = async function (rrf_id) {
    var rrf_detail = await RrfMaster.aggregate([
        {
            $match: {
                "deleted": false,
                "_id": ObjectId(rrf_id)
            }
        },
        {
            $lookup: {
                from: "company_structures",
                localField: "unit",
                foreignField: "id",
                as: "company_structure"
            }
        },
        {
            $unwind: {
                path: "$company_structure"
            }
        },
        {
            $lookup: {
                from: "company_structures",
                localField: "practice",
                foreignField: "id",
                as: "company_structure1"
            }
        },
        {
            $unwind: {
                path: "$company_structure1"
            }
        },
        {
            $lookup: {
                from: "company_structures",
                localField: "sub_practice",
                foreignField: "id",
                as: "company_structure2"
            }
        },
        {
            $unwind: {
                path: "$company_structure2"
            }
        },
        {
            '$lookup': {
                'from': 'job_masters',
                'localField': 'job_code',
                'foreignField': 'id',
                'as': 'job_master'
            }
        },
        {
            $unwind: {
                path: "$job_master"
            }
        },
        {
            $lookup: {
                from: "job_posts",
                localField: "_id",
                foreignField: "rrf_master_id",
                as: "job_post"
            }
        },
        {
            $unwind: {
                path: "$job_post"
            }
        },
        {
            $lookup: {
                from: "candidate_details",
                localField: "_id",
                foreignField: "rrf_master_id",
                as: "candidate_detail"
            }
        },
        // {
        //     $unwind: {
        //         path: "$candidate_detail",
        //         preserveNullAndEmptyArrays: true
        //     }
        // },
        {
            $project: {
                "_id": 1,
                "rrf_code": 1,
                "created_on": 1,
                "created_by": 1,
                "role": 1,
                "status": 1,
                "band": 1,
                "unit_name": "$company_structure.name",
                "practice_name": "$company_structure1.name",
                "sub_practice_name": "$company_structure2.name",
                "unit": "$company_structure.id",
                "practice": "$company_structure1.id",
                "sub_practice": "$company_structure2.id",
                "customer_type": 1,
                "customer_name": 1,
                "interview_round": 1,
                "project": 1,
                "duration": 1,
                "work_location": 1,
                "salary": 1,
                "start_date": 1,
                "billing_start_date": 1,
                "note": 1,
                "source": 1,
                "role": 1,
                "status": 1,
                "candidate_detail": "$candidate_detail",
                "minimum_fitment_score": 1,
                "disselected_job_competency": 1,
                "interview_panel": 1,
                "job_code": 1,
                "job_code_name": "$job_master.job_code",
                "job_master_id": "$job_master.id",
                "job_post_id": "$job_post._id",
                "rrf_code": 1,
                "billable": 1,
                "role_band": 1,
                "billing_start_date": 1,
                "sub_work_location": 1,
                "manager_id": 1,
                "base_location": 1,
                "billing_end_date": 1,
                "no_of_position": 1,
                "customer_interview": 1,
                "customer_job_description": 1,
            }
        }
    ]);
    if (rrf_detail) {
        var job_detail = await this.get_job_detail(rrf_detail[0]["job_master_id"], rrf_detail[0]["job_post_id"]);
        console.log(job_detail)
        return { rrf_detail: rrf_detail[0], job_detail };
    } else {
        return { rrf_detail: '', job_detail: '' };
    }
}


exports.update_rrf_status = async function (rrf_id, update_data) {
    await RrfMaster.findByIdAndUpdate(rrf_id, { $set: update_data }, { upsert: true }, function (err) {
        if (err) {
            console.log(err);
        }
    });
    if (update_data.status == 'RMG Approved' && update_data.with_internal_job == "Yes")
        await JobPost.findOneAndUpdate({ deleted: false, "rrf_master_id": ObjectId(rrf_id) }, { 'active': true });
}

exports.upload_candidate = async function (rrf_id, update_data) {
    update_data['rrf_master_id'] = rrf_id;
    var candidate_detail = new CandidateDetail(update_data);
    candidate_detail.save();
    return await CandidateDetail.aggregate([
        {
            $match: {
                "deleted": false,
                "rrf_master_id": ObjectId(rrf_id)
            }
        },
    ]);
    // var result = await CandidateDetail.findByIdAndUpdate(rrf_id, {
    //     $push: {
    //         candidate_detail: update_data
    //     }
    // }, { new: true });
    // return result;
}


exports.schedule_interview = async function (rrf_id, candidate_id, update_data) {
    await CandidateDetail.findOneAndUpdate({ rrf_master_id: ObjectId(rrf_id), "_id": ObjectId(candidate_id) }, {
        $set: {
            "interview_schedule": update_data.interview_schedule,
            "scheduled_by": update_data.scheduled_by,
            "status": 'Interview Scheduled',
        },
    });
    return await CandidateDetail.aggregate([
        {
            $match: {
                "deleted": false,
                "rrf_master_id": ObjectId(rrf_id)
            }
        },
    ]);
}

exports.get_iof_pending_list = async function (employee_id) {
    return await RrfMaster.aggregate([
        {
            '$unwind': {
                'path': '$interview_panel',
                'includeArrayIndex': 'level',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            $match: {
                'deleted': false,
                'interview_panel.id': Number(employee_id),
            }
        },
        {
            '$lookup': {
                'from': 'candidate_details',
                'localField': '_id',
                'foreignField': 'rrf_master_id',
                'as': 'candidate_detail'
            }
        },
        {
            '$unwind': {
                'path': '$candidate_detail',
            }
        },
        {
            '$unwind': {
                'path': '$candidate_detail.interview_schedule',
            }
        },
        {
            '$match': {
                'candidate_detail.interview_schedule.interview_date': {
                    '$lte': new Date()
                },
                'candidate_detail.interview_schedule.time_range.1': {
                    '$lte': new Date()
                },

                'candidate_detail.interview_schedule.iof_detail': { $exists: false },
                'candidate_detail.status': { $ne: 'Rejected' },
                $expr: { $eq: ['$candidate_detail.interview_schedule.level', "$level"] }
            }
        },
        {
            $group: {
                _id: "$candidate_detail._id",
                allValues: { "$first": "$$ROOT" }
            }
        },
        {
            $project: {
                "_id": 1,
                "role": "$allValues.role",
                "interview_round": "$allValues.interview_round",
                "rrf_code": "$allValues.rrf_code",
                "candidate_detail": "$allValues.candidate_detail",
            }
        }

    ]);
}

exports.save_iof_detail = async function (rrf_id, candidate_id, schedule_id, status, update_data) {
    var result = await CandidateDetail.findOneAndUpdate({ rrf_master_id: ObjectId(rrf_id), "_id": ObjectId(candidate_id), "interview_schedule._id": ObjectId(schedule_id) }, {
        $set: {
            "interview_schedule.$.iof_detail": update_data,
            'status': status
        },
    }, { new: true }, function (err) {
        if (err) {
            console.log(err);
        }
    });
    return result;
}


exports.get_hr_approve_pending_list = async function () {
    return await RrfMaster.aggregate([
        {
            '$lookup': {
                'from': 'candidate_details',
                'localField': '_id',
                'foreignField': 'rrf_master_id',
                'as': 'candidate_detail'
            }
        },
        {
            '$unwind': {
                'path': '$candidate_detail',
            }
        },
        {
            '$match': {
                deleted: false,
                'candidate_detail.status': 'Technical Round Cleared',
            }
        },
        {
            $project: {
                "_id": 1,
                "role": 1,
                "rrf_code": 1,
                "candidate_detail": "$candidate_detail",
            }
        }

    ]);
}

exports.save_hr_iof_detail = async function (rrf_id, candidate_id, status, update_data) {
    var result = await CandidateDetail.findOneAndUpdate({ rrf_master_id: ObjectId(rrf_id), "_id": ObjectId(candidate_id) }, {
        $set: {
            "hr_iof_detail": update_data,
            'status': status
        },
    }, { new: true }, function (err) {
        if (err) {
            console.log(err);
        }
    });
    return result;
}


exports.get_iof_detail = async function (schedule_id) {
    return await CandidateDetail.aggregate([
        {
            '$match': {
                deleted: false,
                'interview_schedule._id': ObjectId(schedule_id)
            }
        },
        {
            $project: {
                "_id": 1,
                "interview_schedule.iof_detail": 1,
            }
        }

    ]);
}

exports.candidate_duplicate_check = async function (rrf_id, email_id) {
    return await CandidateDetail.aggregate([
        {
            $match: {
                "deleted": false,
                "rrf_master_id": ObjectId(rrf_id),
                "candidate_email": email_id
            }
        },
    ]);
}


exports.get_rrf_report_list = async function (condition) {

    return await RrfMaster.aggregate([
        condition,
        {
            $lookup: {
                from: "company_structures",
                localField: "unit",
                foreignField: "id",
                as: "company_structure"
            }
        },
        {
            $unwind: {
                path: "$company_structure"
            }
        },
        {
            '$lookup': {
                'from': 'candidate_details',
                'localField': '_id',
                'foreignField': 'rrf_master_id',
                'as': 'candidate_detail'
            }
        },
        {
            $project: {
                "_id": 1,
                "rrf_code": 1,
                "created_on": 1,
                "created_by": 1,
                "role": 1,
                "status": 1,
                "band": 1,
                "unit": "$company_structure.name",
                "rrf_code": 1,
                "no_of_position": 1,
                "candidate_detail": "$candidate_detail",
                "selected_candidate": {
                    "$size": {
                        "$filter": {
                            "input": "$candidate_detail",
                            "cond": { "$eq": ["$$this.status", "Selected"] }
                        }
                    }
                },
                "rejected_candidate": {
                    "$size": {
                        "$filter": {
                            "input": "$candidate_detail",
                            "cond": { "$eq": ["$$this.status", "Rejected"] }
                        }
                    }
                }
            }
        }
    ]);
}

exports.upload_candidate_document = async function (candidate_id, update_data) {

    await CandidateDetail.findOneAndUpdate({ "_id": ObjectId(candidate_id) }, {
        $set: {
            "candidate_documents": update_data,
            'status': "Documents Uploaded"
        },
    }, { new: true }, function (err) {
        if (err) {
            console.log(err);
        }
    });

    var result = await CandidateDetail.aggregate([
        {
            '$match': {
                deleted: false,
                '_id': ObjectId(candidate_id)
            }
        },
        {
            $project: {
                "_id": 1,
                "candidate_documents": 1,
            }
        }

    ]);
    return result;
}

exports.check_candidate_document = async function (candidate_id) {

    return await CandidateDetail.aggregate([
        {
            '$match': {
                deleted: false,
                '_id': ObjectId(candidate_id),
                'status': "Documents Uploaded"
            }
        },
        {
            $project: {
                "_id": 1,
                "candidate_documents": 1,
            }
        }

    ]);
}


exports.rrf_candidate_approve_list = async function (view_type) {
    var status = [];
    if (view_type == "HR") {
        status.push('Documents Uploaded');
    } else if (view_type == "BUH") {
        status.push('HR Approved');
    } else {
        status.push('BUH Approved');
    }
    return await RrfMaster.aggregate([
        {
            $lookup: {
                from: "company_structures",
                localField: "unit",
                foreignField: "id",
                as: "company_structure"
            }
        },
        {
            $unwind: {
                path: "$company_structure"
            }
        },
        {
            '$lookup': {
                'from': 'candidate_details',
                'localField': '_id',
                'foreignField': 'rrf_master_id',
                'as': 'candidate_detail'
            }
        },
        {
            '$unwind': {
                'path': '$candidate_detail',
            }
        },
        {
            '$match': {
                deleted: false,
                'candidate_detail.status': { $in: status },
            }
        },
        {
            $project: {
                "_id": 1,
                "role": 1,
                "rrf_code": 1,
                "band": 1,
                "created_by": 1,
                "unit": "$company_structure.name",
                "candidate_detail": "$candidate_detail",
            }
        }

    ]);
}

exports.save_rrf_candidate_approve = async function (candidate_id, status, approver_id) {
    var approve_type = {};
    if (status.split(" ")[0] == "HR") {
        approve_type = { "final_approval.hr_approved_by": approver_id, "final_approval.hr_approved_on": new Date(), 'status': status }
    }
    else if (status.split(" ")[0] == "BUH") {
        approve_type = { "final_approval.buh_approved_by": approver_id, "final_approval.buh_approved_on": new Date(), 'status': status }
    } else {
        approve_type = { "final_approval.rmg_approved_by": approver_id, "final_approval.rmg_approved_on": new Date(), 'status': status }
    }
    await CandidateDetail.findOneAndUpdate({ "_id": ObjectId(candidate_id) }, {
        $set: approve_type,
    }, { new: true }, function (err) {
        if (err) {
            console.log(err);
        }
    });

}


exports.get_rrf_and_candidate_detail = async function (candidate_id) {

    return await CandidateDetail.aggregate([
        {
            '$match': {
                deleted: false,
                '_id': ObjectId(candidate_id)
            }
        },
        {
            '$lookup': {
                'from': 'rrf_masters',
                'localField': 'rrf_master_id',
                'foreignField': '_id',
                'as': 'rrf_master'
            }
        },
        {
            $unwind: {
                path: "$rrf_master"
            }
        },
        {
            $lookup: {
                from: "company_structures",
                localField: "rrf_master.unit",
                foreignField: "id",
                as: "company_structure"
            }
        },
        {
            $unwind: {
                path: "$company_structure"
            }
        },
        {
            $lookup: {
                from: "company_structures",
                localField: "rrf_master.practice",
                foreignField: "id",
                as: "company_structure1"
            }
        },
        {
            $unwind: {
                path: "$company_structure1"
            }
        },
    ]);
}


exports.get_ctc_configuration = async function () {

    return await ConfigurationValue.aggregate([
        {
            '$match': {
                deleted: false,
                'key': "ctc_configuration"
            }
        },
    ]);
}


exports.get_organization_skill_list = async function (condition) {

    return await CompetencyStructureMapping.aggregate(

        [
           
            {
                $lookup: {
                    from: "competency_masters",
                    localField: "competency_master_id",
                    foreignField: "id",
                    as: "competency_master"
                }
            },
            {
                $unwind: {
                    path: "$competency_master"
                }
            },
            {
                $lookup: {
                    from: "company_structures",
                    localField: "sub_sbu_id",
                    foreignField: "id",
                    as: "company_structure_sub_practice"
                }
            },
            {
                $unwind: {
                    path: "$company_structure_sub_practice",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "company_structures",
                    localField: "company_structure_sub_practice.parent_id",
                    foreignField: "id",
                    as: "company_structure_practice"
                }
            },
            {
                $unwind: {
                    path: "$company_structure_practice",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "company_structures",
                    localField: "company_structure_practice.parent_id",
                    foreignField: "id",
                    as: "company_structure_unit"
                }
            },
            {
                $unwind: {
                    path: "$company_structure_unit",
                    preserveNullAndEmptyArrays: true
                }
            },
            condition,
            {
                $project: {
                    "_id": 1,
                    "current_role": 1,
                    "unit": "$company_structure_unit.name",
                    "practice": "$company_structure_practice.name",
                    "sub_practice": "$company_structure_sub_practice.name",
                    "competency_name": "$competency_master.competency_name",
                }
            }
        ]
    );
}
