const { validationResult } = require('express-validator');
const mongoose = require('mongoose')
const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const ItemList = require('../models/ItemList');
const ItemService = require('../models/ItemService');
const { GET_ITEM_LIST_GROUP_BY_SERVICES } = require('../helpers/queryHelper');

const getItemList = async (req, res, next) => {
    try {
        const itemList = await ItemList.find();
        responseHelper(res, "Success get item list", 200, true, itemList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const getItemListGroupByServices = async (req, res, next) => {
    try {
        const itemList = await ItemList.aggregate(GET_ITEM_LIST_GROUP_BY_SERVICES());
        responseHelper(res, "Success get item list group by services", 200, true, itemList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getItemById = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const existingItem = await ItemList.aggregate([
            {
                $lookup: {
                    from: 'itemservices',
                    localField: '_id',
                    foreignField: 'itemId',
                    as: 'services'
                },
            },
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(itemId)
                }
            },
            {
                $project: {
                    'services.itemId': 0
                }
            }
        ])
        responseHelper(res, "Success get item by ID", 200, true, existingItem);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const searchItemList = async (req, res, next) => {
    try {
        const { searchTerm } = req.params;
        const itemList = await ItemList.aggregate([
            {
                $lookup: {
                    from: "itemservices",
                    localField: "_id",
                    foreignField: "itemId",
                    as: "services"
                }
            },
            {
                $match: {
                    $or: [
                        { 'name': { $regex: searchTerm, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    'services.itemId': 0
                }
            },
        ])
        responseHelper(res, "Success search item", 200, true, itemList)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const createItem = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemName } = req.body;
        const newItem = new ItemList({
            name: itemName
        })
        const createdItem = await newItem.save();
        responseHelper(res, "Success create item", 200, true, createdItem);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const createItemWithServices = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemName, originalPrice, hangPrice, dryCleanPrice } = req.body;
        const newItem = new ItemList({
            name: itemName
        });
        const createdItem = await newItem.save();
        const services = ["Original (Lipat)", "Gantung", "Dry Clean"];
        const prices = [originalPrice, hangPrice, dryCleanPrice];
        const promises = services.map(async (services, index) => {
            const price = prices[index];
            if (!price) return;
            const newItemService = new ItemService({
                itemId: createdItem,
                name: services,
                price
            });
            await newItemService.save();
        });
        await Promise.all(promises);
        responseHelper(res, "Success create item with services", 201, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateItem = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemId } = req.params;
        const { updatedItemName } = req.body;
        const existingItem = await ItemList.findById(itemId);
        if (!existingItem) errorHelper("Item not found", 404);

        existingItem.name = updatedItemName;
        const updatedItem = await existingItem.save();

        responseHelper(res, "Success update item name", 200, true, { ...updatedItem._doc })
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateItemWithService = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemId } = req.params;
        const { updatedOriginalPrice, updatedHangPrice, updatedDryCleanPrice } = req.body;
        console.log(updatedOriginalPrice, updatedHangPrice, updatedDryCleanPrice);

        const existingItem = await ItemList.findById(itemId);
        if (!existingItem) errorHelper("Item not found", 404);

        const existingItemService = await ItemService.find({ itemId });

        const services = ["Original (Lipat)", "Gantung", "Dry Clean"];
        const prices = [updatedOriginalPrice, updatedHangPrice, updatedDryCleanPrice];

        const promises = services.map(async (service, index) => {
            const price = prices[index];
            if (!price) return;
            const currentItemService = existingItemService.find(itemService => itemService.name === service);
            if (!currentItemService) {
                const newItemService = new ItemService({
                    itemId: existingItem,
                    name: service,
                    price
                });
                await newItemService.save();
            } else {
                currentItemService.price = price;
                await currentItemService.save();
            }
        });
        await Promise.all(promises);
        responseHelper(res, "Success update item with services", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemId } = req.params;
        const existingItem = await ItemList.findById(itemId);
        if (!existingItem) errorHelper("Item not found", 404);
        await ItemList.findByIdAndDelete(itemId);

        await ItemService.deleteMany({ itemId });

        responseHelper(res, "Success delete item", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

module.exports = {
    getItemList,
    getItemListGroupByServices,
    getItemById,
    searchItemList,
    createItem,
    createItemWithServices,
    updateItem,
    updateItemWithService,
    deleteItem
};