const { AdminSchema: Admin } = require('../models/Admin');
const { config } = require('dotenv');
const bcrypt = require('bcryptjs');

config()
const seedOwner = async () => {
    const existingOwner = await Admin.findOne({ username: process.env.SEED_OWNER_USERNAME, role: 'owner' });
    if (existingOwner) return;

    const hashedPassword = await bcrypt.hash(process.env.SEED_OWNER_PASSWORD, 12);
    const newOwner = new Admin({
        username: process.env.SEED_OWNER_USERNAME,
        password: hashedPassword,
        contact: process.env.SEED_OWNER_CONTACT,
        role: 'owner'
    })
    await newOwner.save();
    console.log("Owner created")
}

module.exports = { seedOwner }