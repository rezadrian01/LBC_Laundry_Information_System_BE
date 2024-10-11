const express = require('express');
const { getAdminList, getRoleList, getAdminByRole, createAdmin, updateAdmin, deleteAdmin, getAdminDetail } = require('../controllers/adminController');
const router = express.Router();

router.get('/', getAdminList);
router.get('/:adminId', getAdminDetail)
router.get('/role', getRoleList);
router.get('/role/:role', getAdminByRole);

router.post('/', createAdmin);
router.put('/', updateAdmin);
router.delete('/:adminId', deleteAdmin);

module.exports = router;