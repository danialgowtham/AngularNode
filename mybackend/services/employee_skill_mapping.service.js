// Gettign the Newly created Mongoose Model we just created 
var CompanyStructure = require('../models/company_structure.model');
var CompetencySkillMapping = require('../models/competency_skill_mappings.model');
var CompetencyStructureMapping = require('../models/competency_structure_mappings.model');
var EmployeeSkillSet = require('../models/employee_skill_sets.model')
var EmployeeCompetencyMaster = require('../models/employee_competency_master.model');
var ProficiencyName = require('../models/proficiency_names.model');

exports.get_units = async function (parent_id) {
    console.log(parent_id)
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
    console.log(sub_sbu_id)
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
    console.log(com_str_map_id);
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
    }
    var ess_save_object;
    var ess_update_data = {};
    for (var mapping_id in save_data.updated_data) {
        ess_update_data["experience_month"] = save_data.updated_data[mapping_id]["experience"];
        var experience_array = await get_proficiency(save_data.updated_data[mapping_id]["skill_id"])
        inner_loop: for (var index in experience_array[0].experience_month) {
            if (parseInt(save_data.updated_data[mapping_id]["experience"]) < parseInt(experience_array[0].experience_month[index])) {
                ess_update_data["employee_proficiency"] = experience_array[0].name[index];
                ess_update_data["manager_proficiency"] = "";
                ess_update_data["status"] = "m";
                ess_update_data["modified_on"] = new Date();
                await EmployeeSkillSet.findByIdAndUpdate(mapping_id, { $set: ess_update_data }, { upsert: true }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("inside test")
                });
                break inner_loop;
            }
        }
    }

    for (var key in save_data.data) {
        if (parseInt(save_data.data[key]["experience"]) > 0) {
            ess_save_data["competency_skill_mapping_id"] = save_data.data[key]["skill_id"];
            ess_save_data["experience_month"] = save_data.data[key]["experience"];
            ess_save_data["sub_sbu_id"] = save_data.data[key]["sub_sbu_id"];
            var experience_array = await get_proficiency(save_data.data[key]["skill_id"])
            inner_loop: for (var index in experience_array[0].experience_month) {
                if (parseInt(save_data.data[key]["experience"]) < parseInt(experience_array[0].experience_month[index])) {
                    ess_save_data["employee_proficiency"] = experience_array[0].name[index];
                    ess_save_data["status"] = "m";
                    ess_save_data["modified_on"] = new Date();
                    ess_save_object = new EmployeeSkillSet(ess_save_data);
                    console.log(ess_save_data);
                    await ess_save_object.save();
                    break inner_loop;
                }
            }
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
            // {
            //     $lookup: {
            //         from: "competency_structure_mappings",
            //         localField: "competency_skill_mapping.competency_structure_mapping_id",
            //         foreignField: "id",
            //         as: "competency_structure_mapping"
            //     }
            // },
            // {
            //     $unwind: {
            //         path: "$competency_structure_mapping"
            //     }
            // },
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
                    path: "$company_structure"
                }
            },
            condition,
            {
                $project: {
                    "_id": 1,
                    "strucure": "$company_structure.name",
                    "competency_name": "$competency_master.competency_name",
                    "skill_name": "$skill_master.skill_name",
                    "experience_month": "$employee_skill_set.experience_month",
                    "employee_proficiency": "$employee_proficiency.proficiency_name",
                    "manager_proficiency": "$manager_proficiency.proficiency_name",
                    "employee_skill_set_id": "$employee_skill_set._id",
                    "skill_id": "$competency_skill_mapping.id"
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
exports.save_manger_proficiency = async function (save_data, employee_id, manager_id) {
    await EmployeeCompetencyMaster.updateMany(
        { "employee_id": employee_id },
        {
            $set: {
                "status": "a",
                "approved_by": manager_id,
                "approved_on": new Date()
            }
        }
    )
    for (var key in save_data) {
        console.log(key)
        console.log(save_data[key])
        await EmployeeSkillSet.findByIdAndUpdate(key, { $set: { "manager_proficiency": save_data[key], "status": "a" } }, { upsert: true }, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("inside test1")
        });
        // ess_save_data["competency_skill_mapping_id"] = key;
        // ess_save_data["experience_month"] = save_data.data[key];
        // var experience_array = await get_proficiency(key)
        // inner_loop: for (var index in experience_array[0].experience_month) {
        //     if (parseInt(save_data.data[key]) < parseInt(experience_array[0].experience_month[index])) {
        //         ess_save_data["employee_proficiency"] = experience_array[0].name[index];
        //         ess_save_data["status"] = "m";
        //         ess_save_data["modified_on"] = new Date();
        //         ess_save_object = new EmployeeSkillSet(ess_save_data);
        //         await ess_save_object.save();
        //         break inner_loop;
        //     }
        // }
    }
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