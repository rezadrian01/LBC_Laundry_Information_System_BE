const { ITEM_LIST } = require('../constants/itemList');
const ItemList = require('../models/ItemList');

const seedItemList = async () => {
    await ItemList.deleteMany({});
    for (const item of ITEM_LIST) {
        const newItem = new ItemList({
            name: item.name
        })
        await newItem.save();
    }
    console.log("Item list created")
}

module.exports = { seedItemList }