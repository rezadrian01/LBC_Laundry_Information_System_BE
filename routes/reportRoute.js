const express = require('express');
const { getReportPeriodList, createReport, getReportList, getReportListByPeriod, getReportDetail, deleteReport, getLatestReportListByPeriodAndBranch } = require('../controllers/reportController');
const { createReportValidation, deleteReportValidation } = require('../utils/reportValidation');
const router = express.Router();

// Add Validation
router.get('/', getReportList);
router.get('/reportByPeriod/:period', getReportListByPeriod);
router.get('/reportByPeriod/:period/:branchId', getLatestReportListByPeriodAndBranch);
router.get('/reportPeriod', getReportPeriodList);
router.get('/:reportId', getReportDetail);

router.post('/', createReportValidation, createReport);
router.delete('/:reportId', deleteReportValidation, deleteReport);

module.exports = router;