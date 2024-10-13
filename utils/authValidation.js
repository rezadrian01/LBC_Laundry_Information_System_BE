const { body } = require('express-validator');

const loginValidation = [
    body('username', "Username must be provided").trim().notEmpty().escape(),
    body('password', "Password must be provided").notEmpty(),
]


module.exports = { loginValidation }