const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceListSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model("ServiceList", serviceListSchema);