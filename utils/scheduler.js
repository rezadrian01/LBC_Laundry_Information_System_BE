const moment = require('moment');
const mongoose = require('mongoose');
const { config } = require('dotenv');

const { createNewReport } = require('../helpers/reportHelper');
const Branch = require('../models/BranchList');
const { checkExistingReport } = require('./reportValidation');
const LaundryStatus = require('../models/LaundryStatus');
const Laundry = require('../models/Laundry');

config();
const generateStartDateAndEndDate = (period) => {
    let startDate, endDate;

    if (period === 'day') {
        startDate = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD');
        endDate = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD');
    } else if (period === 'ISOWeek') {
        startDate = moment().subtract(1, 'weeks').startOf('ISOWeek').format('YYYY-MM-DD');
        endDate = moment().subtract(1, 'weeks').endOf('ISOWeek').format('YYYY-MM-DD');
    } else if (period === 'month') {
        startDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        endDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    } else if (period === 'year') {
        startDate = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
        endDate = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD');
    } else {
        throw new Error('Invalid period specified');
    }

    return { startDate, endDate };
};

const generateReportByPeriod = async (period, reportPeriodName) => {
    try {
        console.log(`Generate ${reportPeriodName} report`);
        const { startDate, endDate } = generateStartDateAndEndDate(period);
        // Get branch list
        const branchList = await Branch.find();
        const promises = branchList.map(async (branch) => {
            const existingReport = await checkExistingReport(branch._id, reportPeriodName, startDate, endDate);
            if (existingReport) return;

            // Create report for current branch
            await createNewReport(branch._id, reportPeriodName, startDate, endDate, false);
        });
        await Promise.all(promises);

        // Check and create report for all branches
        const existingReport = await checkExistingReport(null, reportPeriodName, startDate, endDate);
        if (!existingReport) {
            await createNewReport(null, reportPeriodName, startDate, endDate, true);
        }

        console.log(`${reportPeriodName} report generated successfully.`);
    } catch (err) {
        console.error(`Failed to create ${reportPeriodName} report:`, err);
    }
};

const archiveLaundry = async () => {
    try {
        console.log('Archive laundry');
        const limitLastUpdatedAt = moment().subtract(4, 'months').toDate();
        const laundryStatusList = await LaundryStatus.find({
            updatedAt: { $lt: limitLastUpdatedAt },
        });

        const promises = laundryStatusList.map(async (status) => {
            const existingLaundry = await Laundry.findById(status.laundryId);
            if (!existingLaundry) return;
            existingLaundry.isArchive = true;
            await existingLaundry.save();
        });
        await Promise.all(promises);

        console.log('Laundry archived successfully.');
    } catch (err) {
        console.error('Failed to archive laundry:', err);
    }
};

const runScheduler = async (selectedPeriods) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Starting scheduler...');

        // Jalankan laporan hanya untuk periode yang dipilih
        for (const period of selectedPeriods) {
            if (period === 'day') {
                await generateReportByPeriod('day', 'Harian');
            } else if (period === 'ISOWeek') {
                await generateReportByPeriod('ISOWeek', 'Mingguan');
            } else if (period === 'month') {
                await generateReportByPeriod('month', 'Bulanan');
            } else if (period === 'year') {
                await generateReportByPeriod('year', 'Tahunan');
            }
        }

        // Jalankan arsip laundry
        await archiveLaundry();

        console.log('Scheduler completed.');
    } catch (err) {
        console.error('Error in scheduler:', err);
    } finally {
        mongoose.connection.close(); // Tutup koneksi ke MongoDB
        process.exit(0);
    }
};

const args = process.argv.slice(2); // Ambil argumen dari command line
const availablePeriods = ['day', 'ISOWeek', 'month', 'year'];
// Filter periode yang valid dari argumen
const selectedPeriods = args.filter((arg) => availablePeriods.includes(arg));

if (selectedPeriods.length === 0) {
    console.error('No valid period specified. Use: day, ISOWeek, month, year');
    process.exit(1);
}

runScheduler(selectedPeriods).then(() => {
    console.log('Scheduler execution finished.');
});


