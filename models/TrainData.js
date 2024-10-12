const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainDataSchema = new Schema({
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "BranchList",
        required: true
    },
    totalWeightOnBranch: {
        type: Number,
        required: true
    },
    isCuciBasah: {
        type: Number,
        required: true,
        default: 0
    },
    isCuciKering: {
        type: Number,
        required: true,
        default: 0
    },
    isCuciKeringSetrika: {
        type: Number,
        required: true,
        default: 0
    },
    isSetrika: {
        type: Number,
        required: true,
        default: 0
    },
    isKilat: {
        type: Number,
        required: true,
        default: 0
    },
    isExpress: {
        type: Number,
        required: true,
        default: 0
    },
    isReguler: {
        type: Number,
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