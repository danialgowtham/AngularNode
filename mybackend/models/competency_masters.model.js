var mongoose = require('mongoose')

var CompetencyMasterSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    competency_name: { type: String, required: true }
})

const CompetencyMaster = mongoose.model('competency_masters', CompetencyMasterSchema)

module.exports = CompetencyMaster;