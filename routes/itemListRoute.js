const express = require('express');
const { getItemList, updateItem, createItem, deleteItem } = require('../controllers/itemListController');
const router = express.Router();

router.get('/', getItemList);
router.post('/', createItem);
router.put('/', updateItem);
router.delete('/', deleteItem)

module.exports = router;