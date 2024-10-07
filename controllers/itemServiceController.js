const { responseHelper } = require('../helpers/responseHelper');
const ItemService = require('../models/ItemService');

const getItemService = async (req, res, next) => {
    try {
        const itemServices = await ItemService.find();
        responseHelper(res, "Success get item services", 200, true, itemServices);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const getItemServiceByItemId = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const existingItemService = await ItemService.find({ itemId });
        responseHelper(res, "Success get item service by item ID", 200, true, existingItemService);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const createItemService = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const addServiceToItem = async (req, res, next) => {
    try {
        const { itemId, itemServiceId } = req.body;
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


module.exports = { getItemService, getItemServiceByItemId }