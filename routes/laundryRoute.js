const express = require('express');
const { createLaundry } = require('../controllers/laundryController');
const router = express.Router();

router.post('/', createLaundry)

module.exports = router;