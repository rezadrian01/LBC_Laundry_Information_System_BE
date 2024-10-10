const express = require('express');
const { updateLaundryStatus, getTotalLaundryPerStatus, getLaundryListByStatus } = require('../controllers/laundryStatusController');
const router = express.Router();

router.get('/totalLaundryPerStatus', getTotalLaundryPerStatus);
router.get('/status/:statusId', getLaundryListByStatus);

router.put('/:laundryId', updateLaundryStatus);

module.exports = router;