var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var CandidateDetailSchema = new mongoose.Schema({
    rrf_master_id: { type: ObjectId, required: true },
    candidate_name: { type: String, required: true },
    candidate_email: { type: String, required: true },
    candidate_phone_number: { type: String, required: true },
    candidate_current_company: { type: String, required: true },
    candidate_skill_set: { type: String, required: true },
    candidate_total_years_of_experience: { type: String, required: true },
    candidate_relevant_years_of_experience: { type: String, required: true },
    candidate_address: { type: String, required: true },
    candidate_current_ctc: { type: String, required: true },
    candidate_expected_ctc: { type: String, required: true },
    candidate_notice_period: { type: String, required: true },
    candidate_education: { type: String, required: true },
    candidate_current_location: { type: String, required: true },
    candidate_preferred_location: { type: String, required: true },
    candidate_gender: { type: String, required: true },
    candidate_basic_information: { type: String },
    interview_schedule: [{ interview_date: Date, time_range: [Date, Date], iof_detail: {}, level: Number }],
    resume: { type: String, required: true },
    uploaded_by: { type: String, required: true },
    scheduled_by: { type: String },
    uploaded_on: { type: Date, required: true },
    hr_iof_detail: {},
    candidate_documents: { uploaded_on: Date, payslips: Array, bank_statement: Array, degree_certificates: Array, others: Array, experience_letter: Array, cpif: Array, candidate_photo: Array },
    hr_approved_by: { type: String },
    final_approval: { hr_approved_by: String, hr_approved_on: Date, buh_approved_by: String, buh_approved_on: Date, rmg_approved_by: String, rmg_approved_on: Date },
    status: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false },
}, {
        versionKey: false // You should be aware of the outcome after set to false
    })
const CandidateDetail = mongoose.model('candidate_details', CandidateDetailSchema)
module.exports = CandidateDetail;