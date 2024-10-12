const { ReportSchema: Report, reportSchema } = require('../models/Report');
const Laundry = require('../models/Laundry');
const Branch = require('../models/BranchList');

const { responseHelper } = require('../helpers/responseHelper');
const { validateDailyReport, validateWeeklyReport, validateMonthlyReport, validateYearlyReport } = require('../utils/reportValidation');
const { GET_TOTAL_INCOME_AND_TOTAL_TRANSACTION_FROM_LAUNDRY } = require('../helpers/queryHelper');
const { errorHelper } = require('../helpers/errorHelper');

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

        if (reportPeriod?.toLowerCase() === 'harian') validateDailyReport(startDate, endDate);
        if (reportPeriod?.toLowerCase() === 'mingguan') validateWeeklyReport(startDate, endDate);
        if (reportPeriod?.toLowerCase() === 'bulanan') validateMonthlyReport(startDate, endDate);
        if (reportPeriod?.toLowerCase() === 'tahunan') validateYearlyReport(startDate, endDate);

        if (!isAllBranch && !branchId) errorHelper("Branch id must be exist if the report is not for all branch", 400);

        if (isAllBranch && branchId) errorHelper("Branch id must be empty if the report is for all branch", 400);

        if (branchId) {
            const existingBranch = await Branch.findById(branchId);
            if (!existingBranch) errorHelper("Branch not found", 404);
        }

        // validate if the same date and branch is already exist
        const existingReport = await Report.findOne({
            branchId: branchId || null,
            reportPeriod,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        })

        if (existingReport) errorHelper(`This report has already exist`, 409);


        const laundryReports = await Laundry.aggregate(GET_TOTAL_INCOME_AND_TOTAL_TRANSACTION_FROM_LAUNDRY(new Date(startDate), new Date(endDate), isAllBranch ? null : '$branchId'));
        console.log(laundryReports);

        let laundryReportIndex;
        if (!isAllBranch) laundryReportIndex = laundryReports.findIndex(report => report._id?.toString() === branchId)


        const newReport = new Report({
            branchId: isAllBranch ? null : branchId,
            reportPeriod,
            startDate,
            endDate,
            totalIncome: isAllBranch ? laundryReports[0].totalIncome : laundryReports[laundryReportIndex].totalIncome,
            totalTransactions: isAllBranch ? laundryReports[0].totalTransactions : laundryReports[laundryReportIndex].totalTransactions
        })
        const createdReport = await newReport.save();

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