const { body, param } = require("express-validator");

const createWeightPriceValidation = [
    body('maxWeight', 'Max weight must be provided').notEmpty().isNumeric().withMessage("Max weight must be a number"),
    body('price', "Price must be provided").notEmpty().isNumeric().withMessage("Price must be a number")
]

const updateWeightPriceValidation = [
    param('weightPriceId', "Weight price ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('newMaxWeight', "Max weight must be provided").notEmpty().isNumeric().withMessage("Max weight must be a number"),
    body('newPrice', "Price must be provided").notEmpty().isNumeric().withMessage("Price must be a number")
]

const deleteWeightPriceValidation = [
    param('weightPriceId', "Weight price ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { createWeightPriceValidation, updateWeightPriceValidation, deleteWeightPriceValidation }