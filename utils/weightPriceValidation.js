const { body, param } = require("express-validator");

const getWeightPriceByIdValidation = [
    param('weightPriceId', "Invalid weight price ID").trim().notEmpty().isMongoId().withMessage("Invalid MongoDB id")
]

const createWeightPriceValidation = [
    body('maxWeight', 'Max weight must be provided').notEmpty().isNumeric().withMessage("Max weight must be a number"),
    body('price', "Price must be provided").notEmpty().isNumeric().withMessage("Price must be a number")
]

const updateWeightPriceValidation = [
    param('weightPriceId', "Weight price ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedMaxWeight', "Max weight must be provided").notEmpty().isNumeric().withMessage("Max weight must be a number"),
    body('updatedPrice', "Price must be provided").notEmpty().isNumeric().withMessage("Price must be a number")
]

const deleteWeightPriceValidation = [
    param('weightPriceId', "Weight price ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { getWeightPriceByIdValidation, createWeightPriceValidation, updateWeightPriceValidation, deleteWeightPriceValidation };