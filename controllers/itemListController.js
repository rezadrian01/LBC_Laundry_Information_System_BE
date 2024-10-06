const { responseHelper, errorHelper } = require('../helpers/responseHelper');
const ItemList = require('../models/ItemList');

const getItemList = async (req, res, next) => {
    try {
        const itemList = await ItemList.find();
        responseHelper(res, "Success get item list", 200, true, itemList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const createItem = async (req, res, next) => {
    try {
        const { itemName } = req.body;
        const validItemName = itemName.trim();
        const newItem = new ItemList({
            name: validItemName
        })
        const createdItem = await newItem.save();
        responseHelper(res, "Success create item", 200, true, createdItem);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateItem = async (req, res, next) => {
    try {
        const { itemId, updatedItemName } = req.body;
        const existingItem = await ItemList.findById(itemId);
        if (!existingItem) errorHelper("Item not found", 404);

        const validItemName = updatedItemName?.trim()
        if (!validItemName) errorHelper("Invalid item name", 422);

        existingItem.name = validItemName;
        const updatedItem = await existingItem.save();

        responseHelper(res, "Success update item name", 200, true, { ...updatedItem._doc })
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const { itemId } = req.body;
        const existingItem = await ItemList.findById(itemId);
        if (!existingItem) errorHelper("Item not found", 404);
        await ItemList.findByIdAndDelete(itemId);

        responseHelper(res, "Success delete item", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

module.exports = { getItemList, createItem, updateItem, deleteItem }