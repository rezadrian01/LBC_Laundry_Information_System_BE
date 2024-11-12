const { AdminSchema: Admin } = require('../models/Admin');
const { config } = require('dotenv');
const bcrypt = require('bcryptjs');
const BranchList = require('../models/BranchList');
const { BRANCH_LIST } = require('../constants/branchList');

config()
const seedOwner = async () => {
    const existingOwner = await Admin.findOne({ username: process.env.SEED_OWNER_USERNAME, role: 'owner' });
    if (existingOwner) return;

    const hashedPassword = await bcrypt.hash(process.env.SEED_OWNER_PASSWORD, 12);
    const defaultBranch = await BranchList.findOne({ name: BRANCH_LIST[0].name });
    if (!defaultBranch) console.log("Default branch not found");

    const newOwner = new Admin({
        username: process.env.SEED_OWNER_USERNAME,
        password: hashedPassword,
        contact: process.env.SEED_OWNER_CONTACT,
        role: 'owner',
        latestBranchId: defaultBranch
    })
    await newOwner.save();
    console.log("Owner created")
}

module.exports = { seedOwner }