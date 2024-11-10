const { body, param } = require("express-validator");

const createItemListValidation = [
    body('itemName', "Item name must be provided").trim().notEmpty().escape()
]

const updateItemListValidation = [
    param('itemId', "Item ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedItemName', "Updated item name must be provided").trim().notEmpty().escape()
]

const deleteItemListValidation = [
    param('itemId', "Item ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { createItemListValidation, updateItemListValidation, deleteItemListValidation };