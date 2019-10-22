var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed;
var ConfigurationValueSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: Mixed, required: true },
    deleted: { type: Boolean, required: true, default: false },
}, {
        versionKey: false // You should be aware of the outcome after set to false
    })
const ConfigurationValue = mongoose.model('configuration_values', ConfigurationValueSchema)
module.exports = ConfigurationValue;