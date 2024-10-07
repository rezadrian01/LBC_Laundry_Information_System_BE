const express = require('express');
const { getItemService, getItemServiceByItemId, createItemService, updateItemService, deleteItemService } = require('../controllers/itemServiceController');
const router = express.Router();

router.get('/', getItemService)
router.get('/itemId/:itemId', getItemServiceByItemId);
router.post('/:itemId', createItemService);
router.put('/:itemServiceId', updateItemService);
router.delete('/:itemServiceId', deleteItemService);

module.exports = router;