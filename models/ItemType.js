const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemTypeSchema = new Schema({
    laundryId: {
        type: Schema.Types.ObjectId,
        ref: "Laundry",
        required: true
    },
    itemServiceId: {
        type: Schema.Types.ObjectId,
        ref: "ItemService"
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})

module.exports = mongoose.model("ItemType", itemTypeSchema);