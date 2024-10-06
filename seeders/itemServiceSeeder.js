const { ITEM_LIST } = require('../constants/itemList');
const ItemService = require('../models/ItemService');
const ItemList = require('../models/ItemList');

const seedItemService = async () => {
    const existingItemService = await ItemService.findById()
    if (existingItemService?.length !== ITEM_LIST?.length) await ItemService.deleteMany({});

    // Looping items
    for (const item of ITEM_LIST) {
        const existingItem = await ItemList.findOne({ name: item.name });
        if (!existingItem) throw new Error(`Item ${item} was not found`);

        // Looping item service price
        for (const itemService of item.price) {
            const newItemService = new ItemService({
                itemListId: existingItem,
                name: itemService.service,
                price: itemService.price
            })
            await newItemService.save();
        }
    }
}

module.exports = { seedItemService }