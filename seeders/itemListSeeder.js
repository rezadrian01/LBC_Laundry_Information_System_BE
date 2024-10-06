const { ITEM_LIST } = require('../constants/itemList');
const ItemList = require('../models/ItemList');

const seedItemList = async () => {
    const existingItemList = await ItemList.find()
    if (existingItemList.length !== ITEM_LIST.length) await ItemList.deleteMany({});
    for (const item of ITEM_LIST) {
        const newItem = new ItemList({
            name: item.name
        })
        await newItem.save();
    }
    console.log("Item List Created")
}

module.exports = { seedItemList }