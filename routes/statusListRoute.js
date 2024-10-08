const express = require('express');
const { getStatusList, getStatusDetail, createStatus, updateStatus, deleteStatus } = require('../controllers/statusListController');
const router = express.Router();

router.get('/', getStatusList);
router.get('/:statusId', getStatusDetail);
router.post('/', createStatus);
router.put('/:statusId', updateStatus);
router.delete('/:statusId', deleteStatus);

module.exports = router;