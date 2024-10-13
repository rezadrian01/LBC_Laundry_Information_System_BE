const express = require('express');
const { getItemService, getItemServiceByItemId, createItemService, updateItemService, deleteItemService } = require('../controllers/itemServiceController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createItemServiceValidation, updateItemServiceValidation, deleteItemServiceValidation } = require('../utils/itemServiceValidation');
const router = express.Router();

router.get('/', getItemService)
router.get('/itemId/:itemId', getItemServiceByItemId);
router.post('/:itemId', isOwnerOrAdmin, createItemServiceValidation, createItemService);
router.put('/:itemServiceId', isOwnerOrAdmin, updateItemServiceValidation, updateItemService);
router.delete('/:itemServiceId', isOwnerOrAdmin, deleteItemServiceValidation, deleteItemService);

module.exports = router;