var mongoose = require('mongoose')

var CompetencyDictionarySchema = new mongoose.Schema({
    competency_master_id: { type: String, required: true },
    definition: { type: String, required: true },
    proficiency_id: { type: String, required: true },
    description: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false }
})

const CompetencyDictionary = mongoose.model('competency_dictionary', CompetencyDictionarySchema)

module.exports = CompetencyDictionary;