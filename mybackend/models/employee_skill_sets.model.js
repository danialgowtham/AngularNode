var mongoose = require('mongoose')
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var EmployeeSkillSetSchema = new mongoose.Schema({
    employee_competency_master_id: { type: ObjectId, required: true },
    sub_sbu_id: { type: String, required: true },
    competency_skill_mapping_id: { type: String, required: true },
    experience_month: { type: String, required: true },
    employee_proficiency: { type: String, required: true },
    manager_proficiency: { type: String, required: false },
    status:{type:String,required: true},
    modified_on: { type: Date, required: true },
    deleted: { type: Boolean, required: true, default: false },
}, {
        versionKey: false // You should be aware of the outcome after set to false
    })

const EmployeeSkillSet = mongoose.model('employee_skill_sets', EmployeeSkillSetSchema)

module.exports = EmployeeSkillSet;