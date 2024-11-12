const express = require('express');
const router = express.Router();

const { getAdminList, getRoleList, getAdminByRole, createAdmin, updateAdmin, deleteAdmin, getAdminDetail, changeLatestBranch } = require('../controllers/adminController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createAdminValidation, updateAdminValidation, deleteAdminValidation, updateLatestBranchValidation } = require('../utils/adminValidation');

router.get('/', getAdminList);
router.get('/role', getRoleList);
router.get('/:adminId', getAdminDetail);
router.get('/role/:role', getAdminByRole);

router.post('/', isOwnerOrAdmin, createAdminValidation, createAdmin);
router.put('/', isOwnerOrAdmin, updateAdminValidation, updateAdmin);
router.put('/latestBranch/:branchId', updateLatestBranchValidation, changeLatestBranch);
router.delete('/:adminId', deleteAdminValidation, isOwnerOrAdmin, deleteAdmin);

module.exports = router;