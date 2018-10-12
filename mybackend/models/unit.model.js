var mongoose = require('mongoose')



var unitSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    parent_id:{type:String},
    name: { type: String, required: true }
})


const Unit = mongoose.model('Unit', unitSchema)

module.exports = Unit;