const express = require('express');
const { deleteTrainData } = require('../controllers/trainDataController');
const router = express.Router();

router.delete('/:trainDataId', deleteTrainData);

module.exports = router;