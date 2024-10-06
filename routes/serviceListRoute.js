const express = require('express');
const { getServiceList, createServiceList, updateServiceName, deleteServiceName } = require('../controllers/serviceListController');
const router = express.Router();

router.get('/', getServiceList);
router.post('/', createServiceList);
router.put('/', updateServiceName);
router.delete('/', deleteServiceName);

module.exports = router
