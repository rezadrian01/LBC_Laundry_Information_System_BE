const { body } = require("express-validator");

const createItemListValidation = [
    body('itemName', "Item name must be provided").trim().notEmpty()
]

const updateItemListValidation = [
    body('itemId', "Item ID must be provided").trim().notEmpty(),
    body('updatedItemName', "Updated item name must be provided").trim().notEmpty()
]

const deleteItemListValidation = [
    body('itemId', "Item ID must be provided").trim().notEmpty()
]

module.exports = { createItemListValidation, updateItemListValidation, deleteItemListValidation };