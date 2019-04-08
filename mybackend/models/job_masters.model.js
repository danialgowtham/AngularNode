var mongoose = require('mongoose')

var JobMasterSchema = new mongoose.Schema({
    job_code: { type: String, unique: true, required: true },
    role: { type: String, required: true },
    band_name: { type: String, required: true },
    unit_id: { type: String, required: true },
    status: { type: String, required: true },
    created_on: { type: Date, required: true },
    deleted: { type: Boolean, required: true, default: false },
})

const JobMaster = mongoose.model('job_masters', JobMasterSchema)
module.exports = JobMaster;