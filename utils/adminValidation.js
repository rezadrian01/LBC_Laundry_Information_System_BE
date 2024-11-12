const { body, param } = require("express-validator");

const createAdminValidation = [
    body('username', "Username must be provided").trim().notEmpty().isAlphanumeric().withMessage("Please enter a valid username"),
    body('password', "Password must be provided").trim().notEmpty(),
    body('confirmPassword', "Confirm Password must be provided").custom((value, { req }) => {
        if (value !== req.body.password) throw new Error("Password must to be same")
        return true;
    }),
    body('contact', "Contact must be provided").trim().notEmpty().escape(),
    body('role', "Role must be provided").trim().notEmpty().escape()
]

const updateAdminValidation = [
    body('username', "Username must be provided").trim().notEmpty().isAlphanumeric().withMessage("Please enter a valid username"),
    body('oldPassword', "Password must be provided").trim().notEmpty(),
    body('contact', "Contact must be provided").trim().notEmpty().escape(),
]

const updateLatestBranchValidation = [
    param('branchId', "Branch ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid MongoDB id")
]

const deleteAdminValidation = [
    param('adminId', "AdminId must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb Id")
]

module.exports = { createAdminValidation, updateAdminValidation, updateLatestBranchValidation, deleteAdminValidation };