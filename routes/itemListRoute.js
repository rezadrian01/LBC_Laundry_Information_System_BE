const express = require('express');
const router = express.Router();

const { getItemList, updateItem, createItem, deleteItem, searchItemList, getItemById, getItemListGroupByServices, createItemWithServices, updateItemWithService } = require('../controllers/itemListController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createItemListValidation, updateItemListValidation, deleteItemListValidation, createItemWithServicesValidation, updateItemWithServicesValidation } = require('../utils/itemListValidation');

router.get('/', getItemList);
router.get('/group', getItemListGroupByServices);

router.post('/', isOwnerOrAdmin, createItemListValidation, createItem);
router.post('/group', isOwnerOrAdmin, createItemWithServicesValidation, createItemWithServices);

router.put('/:itemId', isOwnerOrAdmin, updateItemListValidation, updateItem);
router.put('/group/:itemId', isOwnerOrAdmin, updateItemWithServicesValidation, updateItemWithService);

router.delete('/:itemId', isOwnerOrAdmin, deleteItemListValidation, deleteItem);
router.delete('/group/:itemId', isOwnerOrAdmin, deleteItemListValidation, deleteItem);

router.get('/search/:searchTerm', searchItemList);
router.get('/:itemId', getItemById);

module.exports = router;