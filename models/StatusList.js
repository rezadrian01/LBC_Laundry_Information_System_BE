const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusListSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Status", statusListSchema);