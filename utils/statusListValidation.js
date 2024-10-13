const { body, param } = require("express-validator");

const createStatusListValidation = [
    body('statusName', "Status name must be provided").trim().notEmpty().escape(),
]

const updateStatusListValidation = [
    param('statusId', 'Status id must be provided').trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedStatusName', 'Status name must be provided').trim().notEmpty().escape(),
]

const deleteStatusListValidation = [
    param('statusId', 'Status id must be provided').trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { createStatusListValidation, updateStatusListValidation, deleteStatusListValidation };