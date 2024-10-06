const Admin = require('../models/Admin');
const { config } = require('dotenv');
const bcrypt = require('bcryptjs');

config();
const seedAdmin = async () => {
    const existingAdmin = await Admin.findOne({ username: process.env.SEED_ADMIN_USERNAME });
    if (existingAdmin) return;

    const hashedPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
    const newAdmin = new Admin({
        username: process.env.SEED_ADMIN_USERNAME,
        password: hashedPassword,
        contact: process.env.SEED_ADMIN_CONTACT,
        role: "admin"
    })
    await newAdmin.save();
    console.log("Admin created");
}

module.exports = { seedAdmin }