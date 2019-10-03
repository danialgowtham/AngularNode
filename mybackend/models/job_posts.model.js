var mongoose = require('mongoose')
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var JobPostSchema = new mongoose.Schema({
    job_code_id: { type: String, required: true },
    rrf_master_id: { type: ObjectId, required: false },
    status: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
    created_by: { type: String, required: true },
    created_on: { type: Date, required: true },
    min_fitment_score: { type: String, required: false },
    job_location: { type: String, required: true },
    job_post_end_date: { type: Date, required: false },
    disselected_job_competency: { type: Array, required: false },
    applied_employees: [{ employee_id: String, manager_agreed: String, applied_on: Date, status: String }],
    deleted: { type: Boolean, required: true, default: false },
}, {
        versionKey: false // You should be aware of the outcome after set to false
    })

const JobPost = mongoose.model('job_posts', JobPostSchema)
module.exports = JobPost;