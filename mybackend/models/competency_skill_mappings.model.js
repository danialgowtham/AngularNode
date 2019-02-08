var mongoose = require('mongoose')

var CompetencySkillMappingSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    competency_master_id: { type: String, required: true },
    skill_master_id: { type: String, required: true },
    proficiency_masters_id: { type: String, required: true }
})

const CompetencySkillMapping = mongoose.model('competency_skill_mappings', CompetencySkillMappingSchema)

module.exports = CompetencySkillMapping;