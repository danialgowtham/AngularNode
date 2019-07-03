var mongoose = require('mongoose')

var JobPostSchema = new mongoose.Schema({
    job_code_id: { type: String, required: true },
    status: { type: String, required: true },
    created_by: { type: String, required: true },
    created_on: { type: Date, required: true },
    min_fitment_score: { type: String, required: false },
    disselected_job_competency: { type: Array, required: false },
    applied_employees: [{ employee_id: String, applied_on: Date, status: String }],
    deleted: { type: Boolean, required: true, default: false },
}, {
        versionKey: false // You should be aware of the outcome after set to false
    })

const JobPost = mongoose.model('job_posts', JobPostSchema)
module.exports = JobPost;