const express = require('express');
const { getItemList, updateItem, createItem, deleteItem, searchItemList } = require('../controllers/itemListController');
const router = express.Router();

router.get('/', getItemList);
router.post('/', createItem);
router.put('/', updateItem);
router.delete('/', deleteItem)
router.get('/search/:searchTerm', searchItemList)

module.exports = router;