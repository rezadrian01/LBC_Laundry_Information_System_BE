const { ReportSchema: Report, reportSchema } = require('../models/Report');
const Laundry = require('../models/Laundry');
const Branch = require('../models/BranchList');

const { responseHelper } = require('../helpers/responseHelper');
const { validateDailyReport, validateWeeklyReport, validateMonthlyReport, validateYearlyReport } = require('../utils/reportValidation');
const { GET_TOTAL_INCOME_AND_TOTAL_TRANSACTION_FROM_LAUNDRY } = require('../helpers/queryHelper');
const { errorHelper } = require('../helpers/errorHelper');
const { createNewReport } = require('../helpers/reportHelper');

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


module.exports = { getReportList, getReportListByPeriod, getReportPeriodList, getReportDetail, createReport, deleteReport };