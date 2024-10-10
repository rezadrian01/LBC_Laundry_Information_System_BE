const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const StatusList = require('../models/StatusList');

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
        const { statusName } = req.body;

        const validStatusName = statusName?.trim();
        if (!validStatusName) errorHelper("Invalid status name", 422);

        const newStatus = new StatusList({
            name: validStatusName
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
        const { statusId } = req.params;
        const { updatedStatusName } = req.body;

        const existingStatus = await StatusList.findById(statusId);
        if (!existingStatus) errorHelper("Status not found", 404);

        const validStatusName = updatedStatusName?.trim();
        if (!validStatusName) errorHelper("Invalid status name", 422);

        existingStatus.name = validStatusName;
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