const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { capital } = require('case')

const LaundryStatus = require('../models/LaundryStatus');
const StatusList = require('../models/StatusList');
const Laundry = require('../models/Laundry');

const { errorHelper } = require('../helpers/errorHelper');
const { responseHelper } = require('../helpers/responseHelper');
const { GET_LAUNDRY_BY_STATUS } = require('../helpers/queryHelper');

const { STATUS_LIST } = require('../constants/statusList');
const { createTrainData } = require('./trainDataController');

// get all laundry with status
const getTotalLaundryPerStatus = async (req, res, next) => {
    let statusList = await StatusList.find();
    statusList = statusList.map(status => ({
        _id: status._id,
        name: capital(status.name)
    }));

    const promises = statusList.map(async (status) => {
        const total = await LaundryStatus.find({ statusId: status._id }).countDocuments();
        status.total = total;
        return { ...status }
    })
    const result = await Promise.all(promises);
    responseHelper(res, "Success get total laundry per status", 200, true, result);
}

const getLaundryListByStatus = async (req, res, next) => {
    try {
        const { page = 1 } = req.query;
        const { statusId } = req.params;
        const existingStatus = await StatusList.findById(statusId);
        if (!existingStatus) errorHelper("Status not found", 404);

        const limit = 15;
        const skip = (page - 1) * limit;
        let laundryList = await LaundryStatus.aggregate(GET_LAUNDRY_BY_STATUS(new mongoose.Types.ObjectId(statusId), limit, skip));
        laundryList = laundryList.map(laundry => ({ ...laundry.laundry }));
        const totalFetched = laundryList.length;
        const totalLaundryList = await LaundryStatus.find({ _id: new mongoose.Types.ObjectId(statusId) });
        responseHelper(res, "Success get laundry by status", 200, true, { laundryList, totalFetched, hasNextPage: totalLaundryList > (skip + limit) });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const updateLaundryStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { laundryId } = req.params;
        const { newStatusId } = req.body;
        ;
        if (!laundryId || !newStatusId) errorHelper("Missing laundryId or newStatusId", 400);

        const existingLaundry = await Laundry.findById(laundryId);
        if (!existingLaundry) errorHelper("Laundry not found", 404);

        const existingLaundryStatus = await LaundryStatus.findOne({ laundryId: existingLaundry });
        if (!existingLaundryStatus) errorHelper("Laundry status not found", 404);

        const existingNewStatus = await StatusList.findById(newStatusId);
        if (!existingNewStatus) errorHelper("Status not found", 404);

        existingLaundryStatus.statusId = existingNewStatus;
        const updatedLaundryStatus = await existingLaundryStatus.save();
        responseHelper(res, "Success update laundry status", 200, true, updatedLaundryStatus);

        // Create train data if status === Siap diambil
        const newStatus = await StatusList.findById(newStatusId);
        if (newStatus.name === STATUS_LIST[3].name) {
            createTrainData(existingLaundry);
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { getTotalLaundryPerStatus, getLaundryListByStatus, updateLaundryStatus }