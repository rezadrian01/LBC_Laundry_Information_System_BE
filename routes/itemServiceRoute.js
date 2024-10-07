const express = require('express');
const { getItemService, getItemServiceByItemId } = require('../controllers/itemServiceController');
const router = express.Router();

router.get('/', getItemService)
router.get('/itemId/:itemId', getItemServiceByItemId);

module.exports = router;