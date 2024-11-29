const { validationResult } = require('express-validator');

const { ReportSchema: Report, reportSchema } = require('../models/Report');

const { responseHelper } = require('../helpers/responseHelper');
const { errorHelper } = require('../helpers/errorHelper');
const { createNewReport } = require('../helpers/reportHelper');
const BranchList = require('../models/BranchList');

const getReportList = async (req, res, next) => {
    try {
        const reportList = await Report.find().populate('branchId');

        responseHelper(res, "Success get report list", 200, true, reportList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getReportListByPeriod = async (req, res, next) => {
    try {
        const { period } = req.params;
        const periodList = await reportSchema.path('reportPeriod').enumValues;

        const existingPeriodIndex = periodList.findIndex(tempPeriod => tempPeriod.toLowerCase() === period.toLowerCase());
        if (existingPeriodIndex === -1) errorHelper("Period not found", 404);

        const reportList = await Report.find({ reportPeriod: periodList[existingPeriodIndex] }).populate('branchId');

        responseHelper(res, "Success get report list", 200, true, reportList);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getLatestReportListByPeriodAndBranch = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());
        const { period, branchId } = req.params;

        // Get period and then get latest report base on branch and limit it base on period
        const periodList = await reportSchema.path('reportPeriod').enumValues;

        const existingPeriodIndex = periodList.findIndex(tempPeriod => tempPeriod.toLowerCase() === period.toLowerCase());
        if (existingPeriodIndex === -1) errorHelper("Period not found", 404);

        if (branchId.trim() !== 'all') {
            const existingBranch = await BranchList.findById(branchId);
            if (!existingBranch) errorHelper("Branch not found", 404);
        }

        let limit;
        if (period.toLowerCase() === 'harian') limit = 7;
        if (period.toLowerCase() === 'mingguan') limit = 5;
        if (period.toLowerCase() === 'bulanan') limit = 6;
        if (period.toLowerCase() === 'tahunan') limit = 5;

        const reportList = await Report.find({
            reportPeriod: periodList[existingPeriodIndex],
            branchId: branchId === 'all' ? null : branchId
        })
            .sort({ endDate: -1 })
            .limit(limit)

        responseHelper(res, "Success get latest report list", 200, true, reportList)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getReportPeriodList = async (req, res, next) => {
    try {
        const periodList = await reportSchema.path('reportPeriod').enumValues;

        responseHelper(res, "Success get report period list", 200, true, { periodList });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


const getReportDetail = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const existingReport = await Report.findById(reportId).populate('branchId');
        if (!existingReport) errorHelper("Report not found", 404);

        responseHelper(res, "Success get report detail", 200, true, existingReport)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const createReport = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());

        const { branchId, reportPeriod, startDate, endDate, isAllBranch } = req.body;

        const createdReport = await createNewReport(branchId, reportPeriod, startDate, endDate, isAllBranch);
        responseHelper(res, "Success create report", 201, true, createdReport);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const deleteReport = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) errorHelper("Validation failed", 422, errors.array());

        const { reportId } = req.params;
        const existingReport = await Report.findById(reportId);
        if (!existingReport) errorHelper("Report not found", 404);

        await Report.findByIdAndDelete(reportId);
        responseHelper(res, "Success delete report", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


module.exports = {
    getReportList,
    getReportListByPeriod,
    getLatestReportListByPeriodAndBranch,
    getReportPeriodList,
    getReportDetail,
    createReport,
    deleteReport
};