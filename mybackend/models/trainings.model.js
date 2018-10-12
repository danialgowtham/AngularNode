var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-aggregate-paginate')//with aggration
//var mongoosePaginateNew=require('mongoose-paginate');// without aggration using
// var autoIncrement = require('mongodb-autoincrement');

var TrainingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    venue: { type: String, required: true },
    date:  { type: Date, required: true },
    band: { type: String, required: false },
    unit: { type: String, required: false },
    program_detail: { type: String, required: false },
    trainer_name: { type: String, required: false },
    nomination_type: { type: String, required: false },
    maximum_nomination: { type: String, required: false },
    status:{type:String,required:true},
    deleted:{type:Boolean,required:true, default:0}
})
TrainingSchema.plugin(mongoosePaginate)
// TrainingSchema.plugin(mongoosePaginateNew)
// TrainingSchema.plugin(autoIncrement.mongoosePlugin);
const Training = mongoose.model('Training', TrainingSchema)


// autoIncrement.setDefaults({
//     model: 'Training',     // collection name for counters, default: counters
//     field: 'id',      
//     startAt:1,         // auto increment field name, default: _id
//     incrementBy: 1             // auto increment step
// });

module.exports = Training;