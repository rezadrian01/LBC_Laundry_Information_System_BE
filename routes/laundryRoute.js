const express = require('express');
const { createLaundry, getLaundryListWithArchive } = require('../controllers/laundryController');
const router = express.Router();

router.get('/all', getLaundryListWithArchive);
router.post('/', createLaundry);

module.exports = router;