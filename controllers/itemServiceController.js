const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const ItemList = require('../models/ItemList');
const ItemService = require('../models/ItemService');
const { validationResult } = require('express-validator');

const getItemService = async (req, res, next) => {
    try {
        const itemServices = await ItemService.find().populate('itemId');
        responseHelper(res, "Success get item services", 200, true, itemServices);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const getItemServiceByItemServiceId = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemServiceId } = req.params;

        const existingItemService = await ItemService.findById(itemServiceId);
        if (!existingItemService) errorHelper("Item service not found", 404);

        responseHelper(res, "Success get item service by item service id", 200, true, existingItemService);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

const getItemServiceByItemIdAndServiceName = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());

        const { itemId } = req.params;
        const { serviceName } = req.body;
        const existingItemService = await ItemService.findOne({ itemId, name: serviceName });
        if (!existingItemService) errorHelper("Item service not found", 404);
        responseHelper(res, "Success get item service by item service id and service name", 200, true, existingItemService);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getItemServiceByItemId = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const existingItemService = await ItemService.find({ itemId }).populate('itemId');
        responseHelper(res, "Success get item service by item ID", 200, true, existingItemService);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const createItemService = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemId } = req.params;
        const { serviceName, servicePrice } = req.body;
        const existingItem = await ItemList.findById(itemId);
        if (!existingItem) errorHelper("Item not found", 404);


        const newItemService = new ItemService({
            itemId: existingItem,
            name: serviceName,
            price: +servicePrice
        })
        const createdItemService = await newItemService.save();
        responseHelper(res, "Success create item service", 201, true, createdItemService);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateItemService = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemServiceId } = req.params;
        const { updatedServiceName, updatedServicePrice } = req.body;
        const existingItemService = await ItemService.findById(itemServiceId);
        if (!existingItemService) errorHelper("Item service not found", 404);

        const validServiceName = updatedServiceName?.trim();
        const validServicePrice = updatedServicePrice;

        if (!validServiceName || !validServicePrice) errorHelper("Invalid service name or service price", 422);

        existingItemService.name = validServiceName;
        existingItemService.price = validServicePrice;
        const updatedItemService = await existingItemService.save();

        responseHelper(res, "Success update item service", 200, true, updatedItemService);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const deleteItemService = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { itemServiceId } = req.params;
        const existingItemService = await ItemService.findById(itemServiceId);
        if (!existingItemService) errorHelper("Item service not found", 404);

        await ItemService.findByIdAndDelete(itemServiceId);
        responseHelper(res, "Success delete item service", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

module.exports = {
    getItemService,
    getItemServiceByItemServiceId,
    getItemServiceByItemIdAndServiceName,
    getItemServiceByItemId,
    createItemService,
    updateItemService,
    deleteItemService
};