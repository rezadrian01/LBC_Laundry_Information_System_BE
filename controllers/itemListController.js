const mongoose = require('mongoose')
const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const ItemList = require('../models/ItemList');
const { validationResult } = require('express-validator');
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

const updateItem = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemId, updatedItemName } = req.body;
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

const deleteItem = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
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

module.exports = { getItemList, getItemListGroupByServices, getItemById, searchItemList, createItem, updateItem, deleteItem };