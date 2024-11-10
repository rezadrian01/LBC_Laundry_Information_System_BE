const { body, param } = require("express-validator");

const createItemListValidation = [
    body('itemName', "Item name must be provided").trim().notEmpty().escape()
]
const createItemWithServicesValidation = [
    body('itemName', "Item name must be provided").trim().notEmpty().escape(),
    body('originalPrice', "Invalid original price").optional().trim().isNumeric().escape(),
    body('hangPrice', "Invalid hang price").optional().trim().isNumeric().escape(),
    body('dryCleanPrice', "Invalid original price").optional().trim().isNumeric().escape(),
]

const updateItemListValidation = [
    param('itemId', "Item ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedItemName', "Updated item name must be provided").trim().notEmpty().escape()
]

const updateItemWithServicesValidation = [
    param('itemId', "Item ID must be provided").trim().notEmpty().isMongoId().escape(),
    body('originalPrice', "Invalid original price").optional().trim().isNumeric().escape(),
    body('hangPrice', "Invalid hang price").optional().trim().isNumeric().escape(),
    body('dryCleanPrice', "Invalid original price").optional().trim().isNumeric().escape(),
]

const deleteItemListValidation = [
    param('itemId', "Item ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = {
    createItemListValidation,
    createItemWithServicesValidation,
    updateItemListValidation,
    updateItemWithServicesValidation,
    deleteItemListValidation
};