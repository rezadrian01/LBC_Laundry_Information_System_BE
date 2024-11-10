const express = require('express');
const router = express.Router();

const { getItemList, updateItem, createItem, deleteItem, searchItemList, getItemById, getItemListGroupByServices } = require('../controllers/itemListController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createItemListValidation, updateItemListValidation, deleteItemListValidation } = require('../utils/itemListValidation');

router.get('/', getItemList);
router.get('/group', getItemListGroupByServices);
router.post('/', isOwnerOrAdmin, createItemListValidation, createItem);
router.put('/', isOwnerOrAdmin, updateItemListValidation, updateItem);
router.delete('/', isOwnerOrAdmin, deleteItemListValidation, deleteItem);

router.get('/search/:searchTerm', searchItemList);
router.get('/:itemId', getItemById);

module.exports = router;