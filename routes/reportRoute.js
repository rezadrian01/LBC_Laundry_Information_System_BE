const express = require('express');
const { getReportPeriodList, createReport, getReportList, getReportListByPeriod, getReportDetail, deleteReport } = require('../controllers/reportController');
const router = express.Router();

router.get('/', getReportList);
router.get('/reportByPeriod/:period', getReportListByPeriod);
router.get('/reportPeriod', getReportPeriodList);
router.get('/:reportId', getReportDetail);
router.post('/', createReport);
router.delete('/:reportId', deleteReport);

module.exports = router;