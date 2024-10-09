const express = require('express');
const { createLaundry, getLaundryList, getLaundryListUnarchived, getLaundryListArchived } = require('../controllers/laundryController');
const router = express.Router();

router.get('/', getLaundryList);
router.get('/unarchived', getLaundryListUnarchived);
router.get('/archived', getLaundryListArchived);
router.post('/', createLaundry);

module.exports = router;