const bcrypt = require('bcryptjs');

const { errorHelper } = require('../helpers/errorHelper');
const { responseHelper } = require('../helpers/responseHelper');
const { AdminSchema: Admin, adminSchema } = require('../models/Admin');


const getAdminList = async (req, res, next) => {
    try {
        const adminList = await Admin.find().select('-password');
        responseHelper(res, "Success get admin list", 200, true, adminList)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getAdminDetail = async (req, res, next) => {
    try {
        const { adminId } = req.params;
        const existingAdmin = await Admin.findById(adminId).select('-password');
        if (!existingAdmin) errorHelper("Admin not found", 404);
        responseHelper(res, "Success get admin detail", 200, true, existingAdmin)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getRoleList = async (req, res, next) => {
    try {

        const roleList = await adminSchema.path('role').enumValues;
        responseHelper(res, "Success get role list", 200, true, { roleList });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const getAdminByRole = async (req, res, next) => {
    try {
        const { role } = req.params;
        const roleList = await adminSchema.path('role').enumValues;
        const validRole = role.toLowerCase();
        const existingRoleIndex = roleList.findIndex(tempRole => tempRole.toLowerCase() === validRole);
        if (existingRoleIndex === -1) errorHelper("Invalid role", 400);
        const adminList = await Admin.find({ role: validRole }).select('-password');

        responseHelper(res, "Success get admin", 200, true, adminList)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const createAdmin = async (req, res, next) => {
    try {
        const { username, password, confirmPassword, contact, role } = req.body;
        let createdAdmin;
        if (password !== confirmPassword) errorHelper("Password must to be same", 400);
        const hashedPassword = await bcrypt.hash(password, 12);

        // validation current admin role
        if (req.currentUserData.role.toLowerCase() !== 'admin') errorHelper("Only admin can create new admin or employees", 400);

        if (role === 'employee') {
            const newAdmin = new Admin({
                username: username,
                password: hashedPassword,
                contact,
                role
            });
            createdAdmin = await newAdmin.save();
        } else if (role === 'admin') {


            const newAdmin = new Admin({
                username: username,
                password: hashedPassword,
                contact,
                role
            });
            createdAdmin = await newAdmin.save();
        }
        else {
            errorHelper("Invalid admin role", 400);
        }
        responseHelper(res, "Success create new admin", 201, true, { ...createdAdmin._doc, password: null })
    } catch (err) {
        if (err.code === 11000) {
            err.statusCode = 409;
            err.message = "Username or contact must be unique";
        }
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateAdmin = async (req, res, next) => {
    try {
        const { username, oldPassword, newPassword, confirmNewPassword, contact } = req.body;

        const invalidNewPassword = newPassword && oldPassword !== newPassword && newPassword !== confirmNewPassword
        if (invalidNewPassword) errorHelper("Password  must to be same", 400);

        const existingAdmin = await Admin.findById(req.currentUserData._id);
        if (!existingAdmin) errorHelper("Admin not found", 404);

        const passwordIsCorrect = await bcrypt.compare(oldPassword, existingAdmin.password);
        if (!passwordIsCorrect) errorHelper("Password is incorrect", 400);

        existingAdmin.username = username || existingAdmin.username;
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            existingAdmin.password = hashedPassword;
        }
        existingAdmin.contact = contact || existingAdmin.contact;
        const updatedAdmin = await existingAdmin.save();

        responseHelper(res, "Success update profile", 200, true, { ...updatedAdmin._doc, password: null });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const deleteAdmin = async (req, res, next) => {
    try {
        const { adminId } = req.params;
        const existingAdmin = await Admin.findById(adminId);
        if (!existingAdmin) errorHelper("Admin not found", 404);
        if (req.currentUserData.role.toLowerCase() !== 'admin') errorHelper("Only admin can delete other admin or employees", 404);

        await Admin.findByIdAndDelete(adminId);
        responseHelper(res, "Success delete admin or employee", 200, true);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { getAdminList, getAdminDetail, getRoleList, getAdminByRole, createAdmin, updateAdmin, deleteAdmin };