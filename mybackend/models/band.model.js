var mongoose = require('mongoose')

var bandSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    parent_id: { type: String },
    name: { type: String, required: true }
})

const Band = mongoose.model('Band', bandSchema)
module.exports = Band;