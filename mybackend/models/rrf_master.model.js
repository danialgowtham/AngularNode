var mongoose = require('mongoose')
var CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_number: { type: Number, default: 0 }
});
var counter = mongoose.model('counters', CounterSchema);
var RrfMasterSchema = new mongoose.Schema({
    rrf_code: { type: String, unique: true },
    unit: { type: String, required: true },
    practice: { type: String, required: true },
    sub_practice: { type: String, required: true },
    band: { type: String, required: true },
    role_band: { type: String, required: true },
    manager_id: { type: String, required: false },
    base_location: { type: String, required: false },
    customer_type: { type: String, required: false },
    customer_name: { type: String },
    project: { type: String },
    billable: { type: String, required: true },
    duration: { type: String, required: true },
    work_location: { type: String, required: true },
    sub_work_location: { type: String },
    interview_round: { type: String, required: true },
    salary: { type: String, required: true },
    start_date: { type: Date, required: true },
    created_on: { type: Date, required: true, default: Date.now },
    billing_start_date: { type: Date },
    billing_end_date: { type: Date },
    note: { type: String },
    source: { type: String },
    customer_job_description: { type: String },
    customer_interview: { type: String, required: true },
    role: { type: String, required: true },
    manager_id: { type: String },
    manager_reject_reason: { type: String },
    manager_status_changed_on: { type: Date },
    rmg_id: { type: String },
    rmg_reject_reason: { type: String },
    with_internal_job: { type: String },
    ijp_end_date: { type: Date },
    rmg_status_changed_on: { type: Date },
    no_of_position: { type: String, required: true },
    job_code: { type: String, required: true },
    status: { type: String, required: true },
    minimum_fitment_score: { type: String },
    disselected_job_competency: { type: Array, required: false },
    interview_panel: [[]],
    created_by: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false },
}, {
        versionKey: false // You should be aware of the outcome after set to false
    })


RrfMasterSchema.pre('save', function (done) {
    var document = this;
    if (document.isNew) { //new Record => create
        counter.findByIdAndUpdate({ _id: 'rrf_id' }, { $inc: { sequence_number: 1 } }, function (error, counter) {
            if (error) {
                console.log("msjdbcjh" + error);
                return done(error);
            }
            console.log(counter);
            var count_string = "" + counter.sequence_number;
            var pad = "00000"
            var rrf_code = "RRF" + pad.substring(0, pad.length - count_string.length) + count_string
            document.rrf_code = rrf_code;
            done();
        });

    } else {
        done()
    }
});

const RrfMaster = mongoose.model('rrf_master', RrfMasterSchema)
module.exports = RrfMaster;