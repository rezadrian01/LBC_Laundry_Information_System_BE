const { responseHelper, errorHelper } = require('../helpers/responseHelper');
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

const createServiceList = async (req, res, next) => {
    try {
        const { serviceName } = req.body;
        const validName = serviceName?.trim();
        if (!validName) errorHelper("Invalid service name", 422)
        const newService = new ServiceList({
            name: validName
        })
        await newService.save();
        responseHelper(res, "Success add new service", 201, true, { ...newService._doc })
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateServiceName = async (req, res, next) => {
    try {
        const { serviceId, updatedName } = req.body;
        const existingService = await ServiceList.findById(serviceId);
        if (!existingService) errorHelper("Service not found", 404);

        const validName = updatedName?.trim();
        existingService.name = validName;
        const updatedService = await existingService.save();
        responseHelper(res, "Success update service name", 200, true, { ...updatedService._doc })
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const deleteServiceName = async (req, res, next) => {
    try {
        const { serviceId } = req.body;
        const existingService = await ServiceList.findById(serviceId);
        if (!existingService) errorHelper("Service not found", 404);
        await ServiceList.findByIdAndDelete(serviceId);
        responseHelper(res, "Success delete service", 200, true)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


module.exports = { createServiceList, getServiceList, updateServiceName, deleteServiceName }