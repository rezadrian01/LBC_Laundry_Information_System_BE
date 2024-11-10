const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const ServiceList = require('../models/ServiceList');
const { validationResult } = require('express-validator');

const getServiceList = async (req, res, next) => {
    try {
        const serviceList = await ServiceList.find()
        responseHelper(res, "Success get service list", 200, true, serviceList)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const getServiceDetail = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { serviceId } = req.params;
        const existingService = await ServiceList.findById(serviceId);
        if (!existingService) errorHelper("Service not found", 404);
        responseHelper(res, "Success get service detail", 200, true, existingService);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const createServiceList = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { serviceName, servicePrice } = req.body;
        const newService = new ServiceList({
            name: serviceName,
            price: +servicePrice
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { serviceId } = req.params;
        const { updatedServiceName, updatedServicePrice } = req.body;
        const existingService = await ServiceList.findById(serviceId);
        if (!existingService) errorHelper("Service not found", 404);

        existingService.name = updatedServiceName;
        existingService.price = +updatedServicePrice;
        const updatedService = await existingService.save();
        responseHelper(res, "Success update service name", 200, true, { ...updatedService._doc })
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const deleteServiceName = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { serviceId } = req.params;
        const existingService = await ServiceList.findById(serviceId);
        if (!existingService) errorHelper("Service not found", 404);
        await ServiceList.findByIdAndDelete(serviceId);
        responseHelper(res, "Success delete service", 200, true)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


module.exports = { getServiceList, getServiceDetail, createServiceList, updateServiceName, deleteServiceName };