const express = require('express');
const { createLaundry, getLaundryList, getLaundryListUnarchived, getLaundryListArchived, getLatestReceiptNumber, getLaundryDetail } = require('../controllers/laundryController');
const router = express.Router();

router.get('/', getLaundryList);
router.get('/unarchived', getLaundryListUnarchived);
router.get('/archived', getLaundryListArchived);
router.get('/receiptNumber', getLatestReceiptNumber);
router.get('/:receiptNumber', getLaundryDetail);

router.post('/', createLaundry);

module.exports = router;