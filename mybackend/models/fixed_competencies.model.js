var mongoose = require('mongoose')

var FixedCompetencySchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    band_name:{type:String,required: true },
    competency_id:{type:String,required: true },
    skill_id:{type:String,required: true },
    proficiency_id: { type: String, required: true }
})

const FixedCompetency = mongoose.model('fixed_competencies', FixedCompetencySchema)

module.exports = FixedCompetency;