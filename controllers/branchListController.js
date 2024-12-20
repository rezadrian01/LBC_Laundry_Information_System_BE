const { validationResult } = require('express-validator');
const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const Branch = require('../models/BranchList');
const { BRANCH_LIST } = require('../constants/branchList');

const getBranchlist = async (req, res, next) => {
    try {
        const branchList = await Branch.find();
        responseHelper(res, "Success get branch list", 200, true, branchList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getBranchDetail = async (req, res, next) => {
    try {
        const { branchId } = req.params;
        const existingBranch = await Branch.findById(branchId);
        if (!existingBranch) errorHelper("Branch not found", 404);
        responseHelper(res, "Success get branch detail", 200, true, existingBranch);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getDefaultBranch = async (req, res, next) => {
    try {
        const defaultBranch = await Branch.findOne({ name: BRANCH_LIST[0].name });
        if (!defaultBranch) errorHelper("Branch not found", 404);
        responseHelper(res, "Success get default branch", 200, true, defaultBranch);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const createBranch = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { branchName, branchAddress } = req.body;

        const newBranch = new Branch({
            name: branchName,
            address: branchAddress
        })
        const createdBranch = await newBranch.save();
        responseHelper(res, "Success create new branch", 201, true, createdBranch);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateBranch = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { branchId } = req.params;
        const { updatedBranchName, updatedBranchAddress } = req.body;

        const existingBranch = await Branch.findById(branchId);
        if (!existingBranch) errorHelper("Branch not found", 404);

        existingBranch.name = updatedBranchName;
        existingBranch.address = updatedBranchAddress;
        const updatedBranch = await existingBranch.save();

        responseHelper(res, "Success update branch", 200, true, updatedBranch);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const deleteBranch = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { branchId } = req.params;
        const existingBranch = await Branch.findById(branchId);
        if (!existingBranch) errorHelper("Branch not found", 404);

        await Branch.findByIdAndDelete(branchId);
        responseHelper(res, "Success delete branch", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { getBranchlist, getBranchDetail, getDefaultBranch, createBranch, updateBranch, deleteBranch };