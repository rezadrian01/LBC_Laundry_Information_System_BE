const express = require('express');
const { login, logout, checkToken } = require('../controllers/authController');
const { loginValidation } = require('../utils/authValidation');
const { isAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', loginValidation, login);
router.get('/check', isAuth, checkToken);
router.post('/logout', logout);

module.exports = router;