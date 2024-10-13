const { body, param } = require("express-validator");

const createBranchListValidation = [
    body('branchName', "Branch name must be provided").trim().notEmpty().escape(),
    body('branchAddress', "Branch address must be provided").trim().notEmpty().escape(),

]

const updateBranchListValidation = [
    param('branchId', "Branch ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
    body('updatedBranchName', "Updated branch name must be provided").trim().notEmpty().escape(),
    body('updatedBranchAddress', "Updated branch address must be provided").trim().notEmpty().escape()
]

const deleteBranchListValidation = [
    param('branchId', "Branch ID must be provided").trim().notEmpty().isMongoId().withMessage("Invalid Mongodb ID"),
]

module.exports = { createBranchListValidation, updateBranchListValidation, deleteBranchListValidation };