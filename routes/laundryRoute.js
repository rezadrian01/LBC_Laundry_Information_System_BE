const express = require('express');
const router = express.Router();
const { createLaundry, getLaundryList, getLaundryListUnarchived, getLaundryListArchived, getLatestReceiptNumber, getLaundryDetailByReceiptNumber, updateIsPaidOffStatus, deleteLaundry, getLaundryInfo, getLaundryDetailById } = require('../controllers/laundryController');
const { isAuth } = require('../middlewares/authMiddleware');
const { createLaundryValidation, updateLaundryValidation } = require('../utils/laundryValidation');

router.get('/', isAuth, getLaundryList);
router.get('/unarchived', isAuth, getLaundryListUnarchived);
router.get('/archived', isAuth, getLaundryListArchived);
router.get('/receiptNumber', isAuth, getLatestReceiptNumber);
router.get('/info/:receiptNumber', getLaundryInfo);
router.get('/receiptNumber/:receiptNumber', isAuth, getLaundryDetailByReceiptNumber);
router.get('/id/:laundryId', isAuth, getLaundryDetailById);

router.put('/isPaidOff/:receiptNumber', isAuth, updateLaundryValidation, updateIsPaidOffStatus);
router.post('/', isAuth, createLaundryValidation, createLaundry);
router.delete('/:receiptNumber', isAuth, deleteLaundry);

module.exports = router;