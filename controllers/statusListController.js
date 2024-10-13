const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const StatusList = require('../models/StatusList');
const { validationResult } = require('express-validator');

const getStatusList = async (req, res, next) => {
    try {
        const statusList = await StatusList.find();
        responseHelper(res, "Success get status list", 200, true, statusList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getStatusDetail = async (req, res, next) => {
    try {
        const { statusId } = req.params;
        const existingStatus = await StatusList.findById(statusId);
        if (!existingStatus) errorHelper("Status not found", 404);

        responseHelper(res, "Success get status detail", 200, true, existingStatus);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const createStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { statusName } = req.body;

        const newStatus = new StatusList({
            name: statusName
        })
        const createdStatus = await newStatus.save();
        responseHelper(res, "Success create status", 201, true, createdStatus);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { statusId } = req.params;
        const { updatedStatusName } = req.body;

        const existingStatus = await StatusList.findById(statusId);
        if (!existingStatus) errorHelper("Status not found", 404);

        existingStatus.name = updatedStatusName;
        const updatedStatus = await existingStatus.save();
        responseHelper(res, "Success update status", 200, true, updatedStatus);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

// Must delete all laundry with this status
const deleteStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { statusId } = req.params;
        const existingStatus = await StatusList.findById(statusId);
        if (!existingStatus) errorHelper("Status not found", 404);

        await StatusList.findByIdAndDelete(statusId);
        responseHelper(res, "Success delete status", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { getStatusList, getStatusDetail, createStatus, updateStatus, deleteStatus }