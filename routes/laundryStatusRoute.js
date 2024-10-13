const express = require('express');
const { updateLaundryStatus, getTotalLaundryPerStatus, getLaundryListByStatus } = require('../controllers/laundryStatusController');
const { updateLaundryStatusValidation } = require('../utils/laundryStatusValidation');
const router = express.Router();

router.get('/totalLaundryPerStatus', getTotalLaundryPerStatus);
router.get('/status/:statusId', getLaundryListByStatus);

router.put('/:laundryId', updateLaundryStatusValidation, updateLaundryStatus);

module.exports = router;