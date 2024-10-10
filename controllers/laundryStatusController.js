const LaundryStatus = require('../models/LaundryStatus');
const StatusList = require('../models/StatusList');
const Laundry = require('../models/Laundry');
const { errorHelper } = require('../helpers/errorHelper');
const { responseHelper } = require('../helpers/responseHelper');

// get all laundry with status

const updateLaundryStatus = async (req, res, next) => {
    try {
        const { laundryId } = req.params;
        const { newStatusId } = req.body;

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

        // Create train data if status === 'Sudah diambil
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { updateLaundryStatus }