var mongoose = require('mongoose')

var ProficiencyNameSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    proficiency_name : { type: String,required:true },
    proficiency_order : { type: String,required:true },
})

const ProficiencyName = mongoose.model('proficiency_names', ProficiencyNameSchema)
module.exports = ProficiencyName;