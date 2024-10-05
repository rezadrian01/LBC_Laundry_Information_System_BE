const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weightPriceSchema = new Schema({
    maxWeight: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("WeightPrice", weightPriceSchema);