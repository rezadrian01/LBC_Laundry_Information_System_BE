const { body, param } = require("express-validator");

const updateLaundryStatusValidation = [
    param('laundryId', 'Laundry ID must be provided').trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('newStatusId', "New status ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { updateLaundryStatusValidation }