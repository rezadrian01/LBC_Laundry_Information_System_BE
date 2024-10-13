const express = require('express');
const { deleteTrainData } = require('../controllers/trainDataController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { deleteTrainDataValidation } = require('../utils/trainDataValidation');
const router = express.Router();

router.delete('/:trainDataId', isOwnerOrAdmin, deleteTrainDataValidation, deleteTrainData);

module.exports = router;