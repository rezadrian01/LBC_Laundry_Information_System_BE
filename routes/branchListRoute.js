const express = require('express');
const { getBranchlist, getBranchDetail, createBranch, updateBranch, deleteBranch } = require('../controllers/branchListController');
const router = express.Router();

router.get('/', getBranchlist);
router.get('/:branchId', getBranchDetail);
router.post('/', createBranch);
router.put('/:branchId', updateBranch);
router.delete('/:branchId', deleteBranch);


module.exports = router;