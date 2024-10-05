const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemServiceSchema = new Schema({
    itemListId: {
        type: Schema.Types.ObjectId,
        ref: 'ItemList',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("ItemService", itemServiceSchema);