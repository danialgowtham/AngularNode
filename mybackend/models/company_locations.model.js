var mongoose = require('mongoose')

var CompanyLocationSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    country_id:{type:String},
    city_id: { type: String, required: true }
})


const CompanyLocation = mongoose.model('company_locations', CompanyLocationSchema)
//mongoose.model('tablename',schema name);

module.exports = CompanyLocation;