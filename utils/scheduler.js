const schedule = require('node-schedule');
const moment = require('moment');

const { createNewReport } = require('../helpers/reportHelper');
const Branch = require('../models/BranchList');
const { checkExistingReport } = require('./reportValidation');
const LaundryStatus = require('../models/LaundryStatus');
const Laundry = require('../models/Laundry');

const DAILY_REPORT_TIME = "0 0 0 * * *";
const WEEKLY_REPORT_TIME = "0 0 0 * * 1";
const MONTHLY_REPORT_TIME = "0 0 0 1 * *";
const YEARLY_REPORT_TIME = "0 0 0 1 1 *";

const MONTHLY_ARCHIVE_LAUNDRY_TIME = "0 0 0 1 * *";


const startScheduler = () => {

    const generateDailyReport = schedule.scheduleJob(DAILY_REPORT_TIME, async () => {
        try {
            console.log('Generate daily report');
            const { startDate, endDate } = generateStartDateAndEndDate('day');
            const reportPeriod = 'Harian';

            // Get branch list
            const branchList = await Branch.find();
            const promises = branchList.map(async (branch) => {
                // Check existing report
                const existingReport = await checkExistingReport(branch._id, reportPeriod, startDate, endDate);
                if (existingReport) return;

                // Create report for current branch
                await createNewReport(branch._id, reportPeriod, startDate, endDate, false);
                return;
            })
            await Promise.all(promises);

            // Check existing report
            const existingReport = await checkExistingReport(null, reportPeriod, startDate, endDate);
            if (existingReport) return;

            // Create report for all branches
            await createNewReport(null, reportPeriod, startDate, endDate, true);
        } catch (err) {
            console.log('Failed to create dialy report');
            console.log(err);
        }
    })

    const generateWeeklyReport = schedule.scheduleJob(WEEKLY_REPORT_TIME, async () => {
        try {

            console.log('Generate weekly report');
            const { startDate, endDate } = generateStartDateAndEndDate('ISOWeek');
            const reportPeriod = 'Mingguan';

            // Get branch list
            const branchList = await Branch.find();
            const promises = branchList.map(async (branch) => {
                // Check existing report
                const existingReport = await checkExistingReport(branch._id, reportPeriod, startDate, endDate)
                if (existingReport) return;

                // Create report for current branch
                await createNewReport(branch._id, reportPeriod, startDate, endDate, false);
                return;
            })
            await Promise.all(promises);

            // Check existing report
            const existingReport = await checkExistingReport(null, reportPeriod, startDate, endDate);
            if (existingReport) return;

            // Create report for all branches
            await createNewReport(null, reportPeriod, startDate, endDate, true);
        } catch (err) {
            console.log("Failed to create weekly report");
            console.log(err);
        }
    })

    const generateMonthlyReport = schedule.scheduleJob(MONTHLY_REPORT_TIME, async () => {
        try {
            console.log('Generate monthly report');
            const { startDate, endDate } = generateStartDateAndEndDate('month');
            const reportPeriod = 'Bulanan';

            // Get branch list
            const branchList = await Branch.find();
            const promises = branchList.map(async (branch) => {
                // Check existing report
                const existingReport = await checkExistingReport(branch._id, reportPeriod, startDate, endDate)
                if (existingReport) return;

                // Create report for current branch
                await createNewReport(branch._id, reportPeriod, startDate, endDate, false);
                return;
            })
            await Promise.all(promises);

            // Check existing report
            const existingReport = await checkExistingReport(null, reportPeriod, startDate, endDate);
            if (existingReport) return;

            // Create report for all branches
            await createNewReport(null, reportPeriod, startDate, endDate, true);
        } catch (err) {
            console.log("Failed to create monthly report");
            console.log(err);
        }
    })

    const generateYearlyReport = schedule.scheduleJob(YEARLY_REPORT_TIME, async () => {
        try {

            console.log('Generate yearly report');
            const { startDate, endDate } = generateStartDateAndEndDate('year');
            const reportPeriod = 'Tahunan';

            // Get branch list
            const branchList = await Branch.find();
            const promises = branchList.map(async (branch) => {
                // Check existing report
                const existingReport = await checkExistingReport(branch._id, reportPeriod, startDate, endDate);
                if (existingReport) return;

                // Create report for current branch
                await createNewReport(branch._id, reportPeriod, startDate, endDate, false)
            })
            await Promise.all(promises);

            // Check existing report
            const existingReport = await checkExistingReport(null, reportPeriod, startDate, endDate);
            if (existingReport) return;

            // Create report for all branches
            await createNewReport(null, reportPeriod, startDate, endDate, true);
        } catch (err) {
            console.log('Failed to create yearly report');
            console.log(err);
        }
    })

    const archiveLaundry = schedule.scheduleJob(MONTHLY_ARCHIVE_LAUNDRY_TIME, async () => {
        try {
            console.log('Archive laundry');
            const limitLastUpdatedAt = moment().subtract(4, 'months').toDate();
            const laundryStatusList = await LaundryStatus.find({
                updatedAt: {
                    $lt: limitLastUpdatedAt
                }
            })
            const promises = laundryStatusList.map(async (status) => {
                const existingLaundry = await Laundry.findById(status.laundryId);
                if (!existingLaundry) return;
                existingLaundry.isArchive = true;
                await existingLaundry.save();
                return;
            })
            await Promise.all(promises);

        } catch (err) {
            console.log("Failed to archive laundry");
            console.log(err);
        }
    })

}


const generateStartDateAndEndDate = (period) => {
    const startDate = moment().startOf(period).format('YYYY-MM-DD');
    const endDate = moment().endOf(period).format('YYYY-MM-DD');
    return { startDate, endDate }
}

module.exports = { startScheduler };