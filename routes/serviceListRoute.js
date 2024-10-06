const express = require('express');
const { getServiceList } = require('../controllers/serviceListController');
const router = express.Router();

router.get('/', getServiceList)

module.exports = router
