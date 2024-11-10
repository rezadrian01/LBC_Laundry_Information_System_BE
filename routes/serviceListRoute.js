const express = require('express');
const router = express.Router();

const { getServiceList, createServiceList, updateServiceName, deleteServiceName, getServiceDetail } = require('../controllers/serviceListController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createServiceListValidation, updateServiceListValidation, deleteServiceListValidation, getServiceDetailValidation } = require('../utils/serviceListValidation');

router.get('/', getServiceList);
router.get('/:serviceId', getServiceDetailValidation, getServiceDetail);
router.post('/', isOwnerOrAdmin, createServiceListValidation, createServiceList);
router.put('/:serviceId', isOwnerOrAdmin, updateServiceListValidation, updateServiceName);
router.delete('/:serviceId', isOwnerOrAdmin, deleteServiceListValidation, deleteServiceName);

module.exports = router
