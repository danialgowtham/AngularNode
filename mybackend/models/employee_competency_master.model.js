var mongoose = require('mongoose')

var EmployeeCompetencyMasterSchema = new mongoose.Schema({
    employee_id: { type: String, required: true },
    approved_by: { type: String, required: false },
    approved_on: { type: Date, required: false },
    current_role: { type: String, required: false },
    status: { type: String, required: true },
    created_on: { type: Date, required: true },
    deleted: { type: Boolean, required: true, default: false },
}, {
        versionKey: false // You should be aware of the outcome after set to false
    })

const EmployeeCompetencyMaster = mongoose.model('employee_competency_masters', EmployeeCompetencyMasterSchema)

module.exports = EmployeeCompetencyMaster;