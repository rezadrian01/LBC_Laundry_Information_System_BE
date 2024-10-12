const Laundry = require('../models/Laundry');
const { GET_TOTAL_WEIGHT_ON_BRANCH } = require('./queryHelper');

const getTotalWeightOnBranch = async (branchId) => {
    const branchData = await Laundry.aggregate(GET_TOTAL_WEIGHT_ON_BRANCH());
    const branchDataIndex = branchData.findIndex(data => data._id.toString() === branchId.toString());
    return { ...branchData[branchDataIndex] }
}

module.exports = { getTotalWeightOnBranch }