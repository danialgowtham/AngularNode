var mongoose = require('mongoose')

var CompetencyStructureMappingSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    sub_sbu_id: { type: String, required: true },
    competency_master_id: { type: String, required: true }
    
})

const CompetencyStructureMapping = mongoose.model('competency_structure_mappings', CompetencyStructureMappingSchema)

module.exports = CompetencyStructureMapping;