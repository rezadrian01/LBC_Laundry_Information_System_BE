const moment = require('moment');

const { getTotalWeightOnBranch } = require('../helpers/laundryHelper');
const TrainData = require('../models/TrainData');
const LaundryService = require('../models/LaundryService');
const { errorHelper } = require('../helpers/errorHelper');
const { responseHelper } = require('../helpers/responseHelper');

const createTrainData = async (existingLaundry) => {
    try {
        const branchId = existingLaundry.branchId;
        const branchData = await getTotalWeightOnBranch(branchId);

        const duration = moment().diff(moment(existingLaundry.createdAt), 'days');
        const laundryServices = await LaundryService.find({ laundryId: existingLaundry._id }).populate('serviceId');
        const newTrainData = new TrainData({
            branchId: branchId,
            totalWeightOnBranch: branchData.totalWeight,
            entryDate: existingLaundry.createdAt,
            totalItems: existingLaundry.totalItems,
            laundryDuration: duration
        })

        for (const { serviceId: service } of laundryServices) {
            switch (service.name) {
                case "CB":
                    newTrainData.isCuciBasah = 1;
                    break;
                case "CK":
                    newTrainData.isCuciKering = 1;
                    break;
                case "CKS":
                    newTrainData.isCuciKeringSetrika = 1;
                    break;
                case "ST":
                    newTrainData.isSetrika = 1;
                    break;
                case "REGULER":
                    newTrainData.isReguler = 1;
                    break;
                case "KILAT":
                    newTrainData.isKilat = 1;
                    break;
                case "EXPRESS":
                    newTrainData.isExpress = 1;
                    break;
            }
        }
        await newTrainData.save();
    } catch (err) {
        console.log(err);
    }
}

const deleteTrainData = async (req, res, next) => {
    try {
        const { trainDataId } = req.params;
        const existingTrainData = await TrainData.findById(trainDataId);
        if (!existingTrainData) errorHelper("Train data not found", 404);
        await TrainData.findByIdAndDelete(trainDataId);

        responseHelper(res, "Success delete train data", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { createTrainData, deleteTrainData }