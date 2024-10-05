const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const laundryStatusSchema = new Schema({
    laundryId: {
        type: Schema.Types.ObjectId,
        ref: "Laundry",
        required: true
    },
    statusId: {
        type: Schema.Types.ObjectId,
        ref: "StatusList",
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("LaundryStatus", laundryStatusSchema);