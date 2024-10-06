const { responseHelper } = require('../helpers/responseHelper');
const ServiceList = require('../models/ServiceList');

const getServiceList = async (req, res, next) => {
    try {
        const serviceList = await ServiceList.find()
        responseHelper(res, "Success get service list", 200, true, serviceList)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}


module.exports = { getServiceList }