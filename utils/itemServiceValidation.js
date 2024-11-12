const { body, param } = require("express-validator");


const getItemServiceByItemIdValidation = [
    param('itemId', "Item ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID")
];

const getItemServiceByItemServiceIdValidation = [
    param('itemServiceId', "Item service ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID")
];

const getItemServiceByItemIdAndServiceNameValidation = [
    param('itemId', "Item ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('serviceName', "Service name must be provided").trim().notEmpty().escape()
]

const createItemServiceValidation = [
    param('itemId', "Item ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('serviceName', "Service Name must be provided").trim().notEmpty().escape(),
    body('servicePrice', "Service Price must be provided").isNumeric()
]

const updateItemServiceValidation = [
    param('itemServiceId', "Service ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedServiceName', "Updated service name must be provided").trim().notEmpty().escape(),
    body('updatedServicePrice', "Invalid updated service price").isNumeric()
]

const deleteItemServiceValidation = [
    param('itemServiceId', "Item service ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = {
    getItemServiceByItemIdValidation,
    getItemServiceByItemServiceIdValidation,
    getItemServiceByItemIdAndServiceNameValidation,
    createItemServiceValidation,
    updateItemServiceValidation,
    deleteItemServiceValidation
};