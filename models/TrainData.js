const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainDataSchema = new Schema({
    totalWeightOnBranch: {
        type: Number,
        required: true
    },
    isCuciBasah: {
        type: Boolean,
        required: true,
        default: 0
    },
    isCuciKering: {
        type: Boolean,
        required: true,
        default: 0
    },
    isCuciKeringSetrika: {
        type: Boolean,
        required: true,
        default: 0
    },
    isSetrika: {
        type: Boolean,
        required: true,
        default: 0
    },
    isKilat: {
        type: Boolean,
        required: true,
        default: 0
    },
    isExpress: {
        type: Boolean,
        required: true,
        default: 0
    },
    isReguler: {
        type: Boolean,
        required: true,
        default: 0
    },
    entryDate: {
        type: Date,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    },
    laundryDuration: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("TrainData", trainDataSchema);