var mongoose = require('mongoose')

var CompanyStructureSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    parent_id:{type:String},
    name: { type: String, required: true }
})

const CompanyStructure = mongoose.model('company_structure', CompanyStructureSchema)

module.exports = CompanyStructure;