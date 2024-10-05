const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['owner', 'admin', 'employee'],
        default: 'employee',
        required: true
    }
})

module.exports = mongoose.model("Admin", adminSchema);