const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const laundrySchema = new Schema({
    receiptNumber: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    },
    weight: {
        type: Number,
    },
    totalItems: {
        type: Number
    },
    customerName: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        default: "",
        required: true
    },
    customerContact: {
        type: String,
        required: true,
        default: ""
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaidOff: {
        type: Boolean,
        required: true
    },
    isArchive: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true })

module.exports = mongoose.model("Laundry", laundrySchema);