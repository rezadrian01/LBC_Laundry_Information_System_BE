const Branch = require("../models/BranchList");
const Laundry = require("../models/Laundry");
const { ReportSchema: Report } = require("../models/Report");
const { validateDailyReport, validateWeeklyReport, validateMonthlyReport, validateYearlyReport, checkExistingReport } = require("../utils/reportValidation");
const { errorHelper } = require("./errorHelper");
const { GET_TOTAL_INCOME_AND_TOTAL_TRANSACTION_FROM_LAUNDRY } = require("./queryHelper");


const createNewReport = async (branchId = null, reportPeriod, startDate, endDate, isAllBranch) => {
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
    const existingReport = await checkExistingReport(branchId, reportPeriod, startDate, endDate);

    if (existingReport) errorHelper(`This report has already exist`, 409);


    const laundryReports = await Laundry.aggregate(GET_TOTAL_INCOME_AND_TOTAL_TRANSACTION_FROM_LAUNDRY(new Date(startDate), new Date(endDate), isAllBranch ? null : '$branchId'));

    let totalIncome = 0;
    let totalTransactions = 0;

    if (laundryReports.length > 0) {
        if (isAllBranch) {
            totalIncome = laundryReports[0]?.totalIncome || 0;
            totalTransactions = laundryReports[0]?.totalTransactions || 0;
        } else {
            const laundryReportIndex = laundryReports.findIndex(report => report._id?.toString() === branchId.toString())
            totalIncome = laundryReports[laundryReportIndex]?.totalIncome || 0;
            totalTransactions = laundryReports[laundryReportIndex]?.totalTransactions || 0;
        }
    }

    const newReport = new Report({
        branchId: isAllBranch ? null : branchId,
        reportPeriod,
        startDate,
        endDate,
        totalIncome,
        totalTransactions
    })
    const createdReport = await newReport.save();
    return createdReport;
}

module.exports = { createNewReport };