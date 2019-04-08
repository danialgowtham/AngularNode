var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var JobCompetencyMappingSchema = new mongoose.Schema({
    job_master_id: { type: ObjectId, required: true },
    competency_master_id: { type: String, required: true },
    competency_proficiency: { type: String, required: true },
    skill_master_id: { type: String, required: true },
    skill_proficiency: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false }
})

const JobCompetencyMapping = mongoose.model('job_competency_mappings', JobCompetencyMappingSchema)
module.exports = JobCompetencyMapping;