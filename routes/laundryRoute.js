const express = require('express');
const { createLaundry, getLaundryList, getLaundryListUnarchived, getLaundryListArchived, getLatestReceiptNumber, getLaundryDetail, updateIsPaidOffStatus, deleteLaundry, getLaundryInfo } = require('../controllers/laundryController');
const { isAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', isAuth, getLaundryList);
router.get('/unarchived', isAuth, getLaundryListUnarchived);
router.get('/archived', isAuth, getLaundryListArchived);
router.get('/receiptNumber', isAuth, getLatestReceiptNumber);
router.get('/info/:receiptNumber', getLaundryInfo);
router.get('/:receiptNumber', isAuth, getLaundryDetail);

router.put('/isPaidOff/:receiptNumber', isAuth, updateIsPaidOffStatus);
router.post('/', isAuth, createLaundry);
router.delete('/:receiptNumber', isAuth, deleteLaundry);

module.exports = router;