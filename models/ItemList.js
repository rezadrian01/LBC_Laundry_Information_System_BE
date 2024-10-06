const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemListSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("ItemList", itemListSchema);