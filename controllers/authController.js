const admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorHelper } = require('../helpers/responseHelper');
const { config } = require('dotenv')


config();
const login = async (req, res, next) => {
    try {
        const { username, password, isRemember } = req.body;

        const existingAdmin = await admin.findOne({ username });
        if (!existingAdmin) errorHelper("Admin not found", 404);

        const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
        if (!isPasswordCorrect) errorHelper("Incorrect password", 401);

        const token = await jwt.sign({
            userId: existingAdmin._id,
            username: existingAdmin.username
        }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRY })

        res.cookie("token", token, { httpOnly: true }).status(200).json({ success: true, message: "Login Success", token: isRemember ? token : null })
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { login }