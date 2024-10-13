const express = require('express');
const { getStatusList, getStatusDetail, createStatus, updateStatus, deleteStatus } = require('../controllers/statusListController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createStatusListValidation, updateStatusListValidation, deleteStatusListValidation } = require('../utils/statusListValidation');
const router = express.Router();

router.get('/', getStatusList);
router.get('/:statusId', getStatusDetail);

router.post('/', isOwnerOrAdmin, createStatusListValidation, createStatus);
router.put('/:statusId', isOwnerOrAdmin, updateStatusListValidation, updateStatus);
router.delete('/:statusId', isOwnerOrAdmin, deleteStatusListValidation, deleteStatus);

module.exports = router;