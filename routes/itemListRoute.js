const express = require('express');
const { getItemList, updateItem, createItem, deleteItem, searchItemList, getItemById } = require('../controllers/itemListController');
const router = express.Router();

router.get('/', getItemList);
router.post('/', createItem);
router.put('/', updateItem);
router.delete('/', deleteItem);

router.get('/search/:searchTerm', searchItemList);
router.get('/:itemId', getItemById);

module.exports = router;