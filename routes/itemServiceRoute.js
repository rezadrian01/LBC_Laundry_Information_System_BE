const express = require('express');
const { getItemService, getItemServiceByItemId, createItemService, updateItemService, deleteItemService, getItemServiceByItemServiceId, getItemServiceByItemIdAndServiceName } = require('../controllers/itemServiceController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createItemServiceValidation, updateItemServiceValidation, deleteItemServiceValidation, getItemServiceByItemIdValidation, getItemServiceByItemServiceIdValidation, getItemServiceByItemIdAndServiceNameValidation } = require('../utils/itemServiceValidation');
const router = express.Router();

router.get('/', getItemService)
router.get('/itemId/:itemId', getItemServiceByItemIdValidation, getItemServiceByItemId);
router.get('/itemServiceId/:itemServiceId', getItemServiceByItemServiceIdValidation, getItemServiceByItemServiceId);
router.post('/itemIdAndServiceName/:itemId', getItemServiceByItemIdAndServiceNameValidation, getItemServiceByItemIdAndServiceName);
router.post('/:itemId', isOwnerOrAdmin, createItemServiceValidation, createItemService);
router.put('/:itemServiceId', isOwnerOrAdmin, updateItemServiceValidation, updateItemService);
router.delete('/:itemServiceId', isOwnerOrAdmin, deleteItemServiceValidation, deleteItemService);

module.exports = router;