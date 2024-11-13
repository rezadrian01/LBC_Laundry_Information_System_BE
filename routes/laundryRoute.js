const express = require('express');
const router = express.Router();
const multer = require('multer');

const { createLaundry, getLaundryList, getLaundryListUnarchived, getLaundryListArchived, getLatestReceiptNumber, getLaundryDetailByReceiptNumber, updateIsPaidOffStatus, deleteLaundry, getLaundryInfo, getLaundryDetailById, getUnarchivedLaundryListByBranch } = require('../controllers/laundryController');
const { isAuth } = require('../middlewares/authMiddleware');
const { createLaundryValidation, updateLaundryValidation } = require('../utils/laundryValidation');

const upload = multer();

router.get('/', isAuth, getLaundryList);
router.get('/unarchived', isAuth, getLaundryListUnarchived);
router.get('/unarchived/:branchId', isAuth, getUnarchivedLaundryListByBranch);
router.get('/archived', isAuth, getLaundryListArchived);
router.get('/receiptNumber', isAuth, getLatestReceiptNumber);
router.get('/info/:receiptNumber', getLaundryInfo);
router.get('/receiptNumber/:receiptNumber', isAuth, getLaundryDetailByReceiptNumber);
router.get('/id/:laundryId', isAuth, getLaundryDetailById);

router.put('/isPaidOff/:receiptNumber', isAuth, updateLaundryValidation, updateIsPaidOffStatus);
router.post('/', isAuth, upload.none(), createLaundryValidation, createLaundry);
router.delete('/:receiptNumber', isAuth, deleteLaundry);

module.exports = router;