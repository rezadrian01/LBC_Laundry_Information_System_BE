const { body, param } = require("express-validator");

const createServiceListValidation = [
    body('serviceName', "Service name must be provided").trim().notEmpty().escape(),
    body('servicePrice', "Service price must be provided").isNumeric(),
]

const updateServiceListValidation = [
    param('serviceId', "Service ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedServiceName', "Updated name must be provided").trim().notEmpty().escape(),
    body('updatedServicePrice', "Updated price must be provided").isNumeric(),
]

const deleteServiceListValidation = [
    param('serviceId', "Service ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { createServiceListValidation, updateServiceListValidation, deleteServiceListValidation };