const express = require('express');
const { getWeightPriceList, getWeightPriceByWeight, createWeightPrice, updateWeightPrice, deleteWeightPrice } = require('../controllers/weightPriceController');
const router = express.Router();

router.get('/', getWeightPriceList);
router.get('/weight', getWeightPriceByWeight);
router.post('/', createWeightPrice);
router.put('/:weightPriceId', updateWeightPrice);
router.delete('/:weightPriceId', deleteWeightPrice)

module.exports = router;