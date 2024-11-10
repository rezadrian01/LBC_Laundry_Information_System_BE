const { validationResult } = require('express-validator');

const { errorHelper } = require('../helpers/errorHelper');
const { responseHelper } = require('../helpers/responseHelper');
const WeightPrice = require('../models/WeightPrice');

const getWeightPriceList = async (req, res, next) => {
    try {
        const weightPriceList = await WeightPrice.find().sort({ maxWeight: 1 });
        responseHelper(res, "Success get weight price list", 200, true, weightPriceList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getWeightPriceByWeight = async (req, res, next) => {
    try {
        const { weight } = req.body;
        if (!weight) errorHelper("Weight must be exist", 400);
        const prices = await WeightPrice.find().sort({ maxWeight: 1 })
        const result = {
            weight,
        }
        for (const price of prices) {
            if (+weight <= price.maxWeight) {
                result.price = price.price;
                result.maxWeight = price.maxWeight;
                break;
            }
        }

        responseHelper(res, "Success get price based on current weight", 200, true, result);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getWeightPriceById = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { weightPriceId } = req.params;
        const existingWeightPrice = await WeightPrice.findById(weightPriceId);
        if (!existingWeightPrice) errorHelper("Weight price not found", 404);
        responseHelper(res, "Success get weight price detail", 200, true, existingWeightPrice);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

getWeightPriceByIdWithPreviousPrice = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());

        const { weightPriceId } = req.params;
        const existingWeightPrice = await WeightPrice.findById(weightPriceId);
        if (!existingWeightPrice) errorHelper("Weight price not found", 404);

        let previousWeightPrice = await WeightPrice.findOne({ maxWeight: { $lt: existingWeightPrice.maxWeight } }).sort({ maxWeight: -1 });

        if (!previousWeightPrice) {
            previousWeightPrice = {
                maxWeight: 0
            };
        }
        responseHelper(res, "Success get weigh price with previous price", 200, true, {
            currentWeightPrice: existingWeightPrice,
            previousWeightPrice
        });

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const createWeightPrice = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());

        const { maxWeight, price } = req.body;
        const newWeightPrice = new WeightPrice({
            maxWeight,
            price
        })
        const createdWeightPrice = await newWeightPrice.save();
        responseHelper(res, "Success create new weight price", 201, true, createdWeightPrice);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateWeightPrice = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());

        const { weightPriceId } = req.params;
        const { updatedMaxWeight, updatedPrice } = req.body;
        const existingWeightPrice = await WeightPrice.findById(weightPriceId);
        if (!existingWeightPrice) errorHelper("Weight price not found", 404);
        existingWeightPrice.maxWeight = +updatedMaxWeight;
        existingWeightPrice.price = +updatedPrice;
        const updatedWeightPrice = await existingWeightPrice.save();
        responseHelper(res, "Success update weight price", 200, true, updatedWeightPrice);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const deleteWeightPrice = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());

        const { weightPriceId } = req.params;
        const existingWeightPrice = await WeightPrice.findById(weightPriceId);
        if (!existingWeightPrice) errorHelper("Weight price not found", 404);
        await WeightPrice.findByIdAndDelete(weightPriceId);
        responseHelper(res, "Success delete weight price", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { getWeightPriceList, getWeightPriceByWeight, getWeightPriceById, getWeightPriceByIdWithPreviousPrice, createWeightPrice, updateWeightPrice, deleteWeightPrice };