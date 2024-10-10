const Laundry = require('../models/Laundry');
const LaundryService = require('../models/LaundryService');
const ServiceList = require('../models/ServiceList');
const ItemType = require('../models/itemType');
const LaundryStatus = require('../models/LaundryStatus');
const WeightPrice = require('../models/WeightPrice');
const ItemService = require('../models/ItemService');
const StatusList = require('../models/StatusList');
const { STATUS_LIST } = require('../constants/statusList');

const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const { GET_LAUNDRY_LIST, GET_LAUNDRY_LIST_UNARCHIVED, GET_LAUNDRY_LIST_ARCHIVED, GET_LAUNDRY_BY_RECEIPT_NUMBER } = require('../helpers/queryHelper');

let receiptNumberCounter = 0;

const getLaundryList = async (req, res, next) => {
    try {
        const laundryList = await Laundry.aggregate(GET_LAUNDRY_LIST)
        responseHelper(res, "Success get all laundry", 200, true, laundryList)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getLaundryListUnarchived = async (req, res, next) => {
    try {
        const laundryList = await Laundry.aggregate(GET_LAUNDRY_LIST_UNARCHIVED);
        responseHelper(res, "Success get unarchived laundry list", 200, true, laundryList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getLaundryListArchived = async (req, res, next) => {
    try {
        const laundryList = await Laundry.aggregate(() => GET_LAUNDRY_LIST_ARCHIVED);
        responseHelper(res, "Success get unarchived laundry list", 200, true, laundryList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const getLaundryDetail = async (req, res, next) => {
    try {
        const existingLaundry = await Laundry.aggregate(GET_LAUNDRY_BY_RECEIPT_NUMBER(+req.params.receiptNumber));
        if (existingLaundry.length === 0) errorHelper("Laundry not found", 404)
        responseHelper(res, "Success get laundry detail", 200, true, existingLaundry[0])
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getLaundryInfo = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const createLaundry = async (req, res, next) => {
    try {
        const { receiptNumber, branchId, weight, items, totalItems, customerName, customerAddress, customerContact, isPaidOff, services, isWeight } = req.body;

        const newLaundry = new Laundry({
            receiptNumber: +receiptNumber,
            branchId: branchId,
            customerName: customerName,
            customerAddress: customerAddress || "",
            customerContact: customerContact || "",
            isPaidOff: isPaidOff,
        })

        let totalPrice = 0;
        const itemServiceList = [];

        if (isWeight == 'true') {
            if (items?.length > 0) errorHelper("Items must be empty if you choose with weight not an items", 400);
            if (!weight) errorHelper("Weight must be exist", 422);
            const prices = await WeightPrice.find().sort({ maxWeight: 1 });

            // search price for current weight
            for (const price of prices) {
                if (+weight <= price.maxWeight) {
                    totalPrice = price.price;
                    break;
                }
            }

            // add weight and total items field to new laundry
            newLaundry.weight = weight;
            if (totalItems) newLaundry.totalItems = totalItems;
        }
        else {
            if (!items) errorHelper("Items must be exist", 422);
            let tempTotalItems = 0;
            const promises = Object.keys(items).map(async (key) => {

                // temporary item service list
                itemServiceList.push({ ...items[key] });

                // calculate total items
                tempTotalItems += +items[key].quantity;

                // search existing item service to get the price
                const existingItemService = await ItemService.findById(items[key].itemServiceId);
                if (!existingItemService) errorHelper("Item service not found", 404);

                return existingItemService.price * items[key].quantity;
            })

            const subtotals = await Promise.all(promises);
            totalPrice = subtotals.reduce((total, subtotal) => total + subtotal, 0);

            // add totalItems field to new laundry
            newLaundry.totalItems = tempTotalItems;

            // add weight field if exist
            if (weight) newLaundry.weight = weight;

        }
        // add totalPrice field to new laundry
        newLaundry.totalPrice = totalPrice;
        const createdLaundry = await newLaundry.save();

        // service laundry
        for (const key of Object.keys(services)) {
            const existingService = await ServiceList.findById(services[key].id)
            if (!existingService) errorHelper("Service not found", 404);

            const newLaundryService = new LaundryService({
                laundryId: createdLaundry,
                serviceId: existingService
            })
            await newLaundryService.save();
        }

        // item type
        if (isWeight == 'false') {
            for (const itemType of itemServiceList) {
                const newItemType = new ItemType({
                    laundryId: createdLaundry,
                    itemServiceId: itemType.itemServiceId,
                    quantity: itemType.quantity
                })
                await newItemType.save();
            }
        }

        // laundry status
        const existingStatusList = await StatusList.findOne({ name: STATUS_LIST[0].name || "Diterima" });
        const newLaundryStatus = new LaundryStatus({
            laundryId: createdLaundry,
            statusId: existingStatusList,
        })
        await newLaundryStatus.save();

        responseHelper(res, "Success create new laundry", 201, true)
    } catch (err) {
        // Duplicate entry
        if (err.code === 11000) {
            err.message = "Cannot create laundry with same receipt number";
            err.statusCode = 409;
        }
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateLaundry = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const deleteLaundry = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getLatestReceiptNumber = async (req, res, next) => {
    try {
        const lastReceiptNumber = await Laundry.findOne().sort({ createdAt: -1 }).limit(1);
        responseHelper(res, "Success get latest receipt number", 200, true, { latestReceiptNumber: lastReceiptNumber?.receiptNumber || receiptNumberCounter });
        if (!lastReceiptNumber) receiptNumberCounter++;
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { getLaundryList, getLaundryListUnarchived, getLaundryListArchived, getLaundryDetail, getLaundryInfo, createLaundry, updateLaundry, deleteLaundry, getLatestReceiptNumber }