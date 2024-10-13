const express = require('express');
const { login, logout } = require('../controllers/authController');
const { loginValidation } = require('../utils/authValidation');
const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/logout', logout)

module.exports = router;