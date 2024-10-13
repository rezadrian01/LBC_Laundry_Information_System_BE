const express = require('express');
const router = express.Router();

const { getWeightPriceList, getWeightPriceByWeight, createWeightPrice, updateWeightPrice, deleteWeightPrice } = require('../controllers/weightPriceController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createWeightPriceValidation, updateWeightPriceValidation, deleteWeightPriceValidation } = require('../utils/weightPriceValidation');

router.get('/', getWeightPriceList);
router.get('/weight', getWeightPriceByWeight);

router.post('/', isOwnerOrAdmin, createWeightPriceValidation, createWeightPrice);
router.put('/:weightPriceId', isOwnerOrAdmin, updateWeightPriceValidation, updateWeightPrice);
router.delete('/:weightPriceId', isOwnerOrAdmin, deleteWeightPriceValidation, deleteWeightPrice)

module.exports = router;