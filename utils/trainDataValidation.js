const { param } = require("express-validator");

const deleteTrainDataValidation = [
    param('trainDataId', "Train data ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID")
]

module.exports = { deleteTrainDataValidation };