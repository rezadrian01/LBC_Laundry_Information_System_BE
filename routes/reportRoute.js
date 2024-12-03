const express = require('express');
const { getReportPeriodList, createReport, getReportList, getReportListByPeriod, getReportDetail, deleteReport, getLatestReportListByPeriodAndBranch, getLatestReportListByBranch } = require('../controllers/reportController');
const { createReportValidation, deleteReportValidation } = require('../utils/reportValidation');
const router = express.Router();

// Add Validation
router.get('/', getReportList);
router.get('/reportByPeriod/:period', getReportListByPeriod);
router.get('/reportByPeriod/:period/:branchId', getLatestReportListByPeriodAndBranch);
router.get('/reportPeriod', getReportPeriodList);
router.get('/reportByBranch/:branchId', getLatestReportListByBranch)
router.get('/:reportId', getReportDetail);

router.post('/', createReportValidation, createReport);
router.delete('/:reportId', deleteReportValidation, deleteReport);

module.exports = router;