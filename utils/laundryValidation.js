const { body } = require('express-validator')


const createLaundryValidation = [
    body('receiptNumber', "Receipt number must be provided").trim().notEmpty(),
    body('branchId', "Branch id must be provided").trim().notEmpty(),
    body('customerName', "Customer name must be provided").trim().notEmpty(),
    body('isPaidOff', "isPaidOff status must be provided").notEmpty()
]

const updateLaundryValidation = [
    body('isPaidOff', "isPaidOff status must be provided").notEmpty()
]

module.exports = { createLaundryValidation, updateLaundryValidation };