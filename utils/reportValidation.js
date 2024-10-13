const moment = require('moment');
const { errorHelper } = require('../helpers/errorHelper');
const { ReportSchema: Report } = require('../models/Report');

const getLastDateOfMonth = (year, month) => {
    return moment([year, month - 1]).endOf('month').toDate();
}

const validateYearlyReport = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);

    if (start.date() !== 1 || start.month() !== 0) errorHelper("Start date must be first date on current year", 400);

    if (end.date() !== 31 || end.month() !== 11) errorHelper("End date must be last date on current year", 400);

    if (start.isAfter(end)) errorHelper("End date must be after start date", 400);

    return true;
}

const validateMonthlyReport = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);

    if (start.date() !== 1) errorHelper("Date must be 1", 400);

    const lastDayOfMonth = getLastDateOfMonth(start.year(), start.month() + 1);
    if (!end.isSame(lastDayOfMonth, 'day')) errorHelper("Date must be last day of month", 400);

    if (start.isAfter(end)) errorHelper("End date must be after start date", 400);

    return true;
}

const validateWeeklyReport = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);

    if (start.isoWeekday() !== 1) errorHelper("Date must be first day of week (Monday)", 400);
    if (end.isoWeekday() !== 7) errorHelper("Date must be last day of week (Sunday)", 400);

    const diffDays = end.diff(start, 'days');
    if (diffDays !== 6) errorHelper("Weekly report must cover exactly 7 days.");

    if (start.isAfter(end)) errorHelper("End date must be after start date", 400);

    return true;
}

const validateDailyReport = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);


    if (!start.isSame(end, 'day')) errorHelper("Start date must be the same as end date", 400);
    if (start.isAfter(end)) errorHelper("End date must be after start date", 400);

    return true;
}

const checkExistingReport = async (branchId, reportPeriod, startDate, endDate) => {
    try {
        const existingReport = await Report.findOne({
            branchId,
            reportPeriod,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        })
        return existingReport;
    } catch (err) {
        return null;
    }
}



module.exports = { validateYearlyReport, validateMonthlyReport, validateWeeklyReport, validateDailyReport, checkExistingReport };