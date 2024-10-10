const express = require('express');
const { updateLaundryStatus } = require('../controllers/laundryStatusController');
const router = express.Router();

router.put('/:laundryId', updateLaundryStatus);

module.exports = router;