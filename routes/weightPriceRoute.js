const express = require('express');
const router = express.Router();

const { getWeightPriceList, getWeightPriceByWeight, createWeightPrice, updateWeightPrice, deleteWeightPrice, getWeightPriceById, getWeightPriceByIdWithPreviousPrice } = require('../controllers/weightPriceController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createWeightPriceValidation, updateWeightPriceValidation, deleteWeightPriceValidation, getWeightPriceByIdValidation } = require('../utils/weightPriceValidation');

router.get('/', getWeightPriceList);
router.post('/weight', getWeightPriceByWeight);
router.get('/:weightPriceId', getWeightPriceByIdValidation, getWeightPriceById);
router.get('/withPrevious/:weightPriceId', getWeightPriceByIdValidation, getWeightPriceByIdWithPreviousPrice);

router.post('/', isOwnerOrAdmin, createWeightPriceValidation, createWeightPrice);
router.put('/:weightPriceId', isOwnerOrAdmin, updateWeightPriceValidation, updateWeightPrice);
router.delete('/:weightPriceId', isOwnerOrAdmin, deleteWeightPriceValidation, deleteWeightPrice)

module.exports = router;