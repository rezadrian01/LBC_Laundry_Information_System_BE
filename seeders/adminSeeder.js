const { AdminSchema: Admin } = require('../models/Admin');
const { config } = require('dotenv');
const bcrypt = require('bcryptjs');
const { BRANCH_LIST } = require('../constants/branchList');
const BranchList = require('../models/BranchList');

config();
const seedAdmin = async () => {
    const existingAdmin = await Admin.findOne({ username: process.env.SEED_ADMIN_USERNAME });
    if (existingAdmin) return;

    const hashedPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
    const defaultBranch = await BranchList.findOne({ name: BRANCH_LIST[0].name });
    if (!defaultBranch) console.log("Default branch not found");

    const newAdmin = new Admin({
        username: process.env.SEED_ADMIN_USERNAME,
        password: hashedPassword,
        contact: process.env.SEED_ADMIN_CONTACT,
        role: "admin",
        latestBranchId: defaultBranch
    })
    await newAdmin.save();
    console.log("Admin created");
}

module.exports = { seedAdmin }