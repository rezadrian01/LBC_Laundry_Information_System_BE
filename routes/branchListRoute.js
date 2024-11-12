const express = require('express');
const router = express.Router();
const { getBranchlist, getBranchDetail, createBranch, updateBranch, deleteBranch, getDefaultBranch } = require('../controllers/branchListController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createBranchListValidation, updateBranchListValidation, deleteBranchListValidation } = require('../utils/branchListValidation');

router.get('/', getBranchlist);
router.get('/default', getDefaultBranch);
router.get('/:branchId', getBranchDetail);
router.post('/', isOwnerOrAdmin, createBranchListValidation, createBranch);
router.put('/:branchId', isOwnerOrAdmin, updateBranchListValidation, updateBranch);
router.delete('/:branchId', isOwnerOrAdmin, deleteBranchListValidation, deleteBranch);


module.exports = router;