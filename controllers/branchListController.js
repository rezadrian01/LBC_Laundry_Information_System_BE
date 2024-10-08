const { responseHelper, errorHelper } = require('../helpers/responseHelper');
const Branch = require('../models/BranchList');

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

const createBranch = async (req, res, next) => {
    try {
        const { branchName, branchAddress } = req.body;

        const validBranchName = branchName?.trim();
        const validBranchAddress = branchAddress?.trim();

        if (!validBranchName || !validBranchAddress) errorHelper("Invalid branch name or branch address", 422);

        const newBranch = new Branch({
            name: validBranchName,
            address: validBranchAddress
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
        const { branchId } = req.params;
        const { updatedBranchName, updatedBranchAddress } = req.body;

        const existingBranch = await Branch.findById(branchId);
        if (!existingBranch) errorHelper("Branch not found", 404);

        existingBranch.name = updatedBranchName || existingBranch.name;
        existingBranch.address = updatedBranchAddress || existingBranch.address;
        const updatedBranch = await existingBranch.save();

        responseHelper(res, "Success update branch", 200, true, updatedBranch);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const deleteBranch = async (req, res, next) => {
    try {
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

module.exports = { getBranchlist, getBranchDetail, createBranch, updateBranch, deleteBranch }