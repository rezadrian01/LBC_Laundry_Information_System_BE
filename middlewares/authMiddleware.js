const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const Admin = require('../models/Admin');

const { errorHelper } = require('../helpers/errorHelper');

config();
const isAuth = async (req, res, next) => {
    try {
        let token = req.get('Authorization')?.split(" ")[1];
        if (!token) token = req.headers?.cookie?.split("=")[1]
        if (!token) errorHelper("No token provided", 401);

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodedToken) errorHelper("Invalid token provided", 401);
        const existingAdmin = await Admin.findById(decodedToken.userId);
        if (!existingAdmin) errorHelper("Admin not found", 404);

        req.isAuth = true;
        req.currentUserData = existingAdmin;
        next()
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { isAuth }