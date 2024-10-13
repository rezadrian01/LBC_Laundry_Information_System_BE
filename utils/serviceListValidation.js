const { body } = require("express-validator");

const createServiceListValidation = [
    body('serviceName', "Service name must be provided").trim().notEmpty()
]

const updateServiceListValidation = [
    body('serviceId', "Service ID must be provided").trim().notEmpty(),
    body('updatedServiceName', "Updated name must be provided").trim().notEmpty()
]

const deleteServiceListValidation = [
    body('serviceId', "Service ID must be provided").trim().notEmpty()
]

module.exports = { createServiceListValidation, updateServiceListValidation, deleteServiceListValidation };