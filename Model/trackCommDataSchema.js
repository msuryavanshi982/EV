const mongoose = require('mongoose');
const trackDataSchema = mongoose.Schema({
    property_id: { type: String },
    modified: { type: String },
    deleted: { type: String }
});

module.exports = mongoose.model('Track_Comm_Data', trackDataSchema);