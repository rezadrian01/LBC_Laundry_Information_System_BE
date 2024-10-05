const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const laundryServiceSchema = new Schema({
    laundryId: {
        type: Schema.Types.ObjectId,
        ref: "Laundry",
        required: true
    },
    serviceListId: {
        type: Schema.Types.ObjectId,
        ref: "ServiceList",
        required: true
    }
})

module.exports = mongoose.model("LaundryService", laundryServiceSchema);