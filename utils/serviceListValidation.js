const { body } = require("express-validator");

const createServiceListValidation = [
    body('serviceName', "Service name must be provided").trim().notEmpty().escape()
]

const updateServiceListValidation = [
    body('serviceId', "Service ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedServiceName', "Updated name must be provided").trim().notEmpty().escape()
]

const deleteServiceListValidation = [
    body('serviceId', "Service ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { createServiceListValidation, updateServiceListValidation, deleteServiceListValidation };