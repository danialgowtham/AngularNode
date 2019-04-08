var mongoose = require('mongoose')

var SkillMasterSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    competency_name: { type: String, required: true }
})

const SkillMaster = mongoose.model('skill_masters', SkillMasterSchema)

module.exports = SkillMaster;