const express = require('express');
const router = express.Router();

const { getServiceList, createServiceList, updateServiceName, deleteServiceName } = require('../controllers/serviceListController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createServiceListValidation, updateServiceListValidation, deleteServiceListValidation } = require('../utils/serviceListValidation');

router.get('/', getServiceList);
router.post('/', isOwnerOrAdmin, createServiceListValidation, createServiceList);
router.put('/', isOwnerOrAdmin, updateServiceListValidation, updateServiceName);
router.delete('/', isOwnerOrAdmin, deleteServiceListValidation, deleteServiceName);

module.exports = router
