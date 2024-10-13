const express = require('express');
const { getBranchlist, getBranchDetail, createBranch, updateBranch, deleteBranch } = require('../controllers/branchListController');
const { isOwnerOrAdmin } = require('../middlewares/authMiddleware');
const { createBranchListValidation, updateBranchListValidation, deleteBranchListValidation } = require('../utils/branchListValidation');
const router = express.Router();

router.get('/', getBranchlist);
router.get('/:branchId', getBranchDetail);
router.post('/', isOwnerOrAdmin, createBranchListValidation, createBranch);
router.put('/:branchId', isOwnerOrAdmin, updateBranchListValidation, updateBranch);
router.delete('/:branchId', isOwnerOrAdmin, deleteBranchListValidation, deleteBranch);


module.exports = router;