const { body, param } = require("express-validator");

const createItemServiceValidation = [
    param('itemId', "Invalid item ID").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('serviceName', "Service Name must be provided").trim().notEmpty().escape(),
    body('servicePrice', "Service Price must be provided").isNumeric()
]

const updateItemServiceValidation = [
    param('itemServiceId', "Invalid service ID").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedServiceName', "Updated service name must be provided").trim().notEmpty().escape(),
    body('updatedServicePrice', "Invalid updated service price").isNumeric()
]

const deleteItemServiceValidation = [
    param('itemServiceId', "Item service ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { createItemServiceValidation, updateItemServiceValidation, deleteItemServiceValidation }