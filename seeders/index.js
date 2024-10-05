const mongoose = require('mongoose');
const { config } = require('dotenv');
const { seedAdmin } = require('./adminSeeder');
const { seedOwner } = require('./ownerSeeder');

config();
const seeder = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await seedAdmin();
    await seedOwner();
}

seeder().then(() => {
    console.log("=======================================")
    console.log("==========  Seeder finished  ==========")
    console.log("=======================================")
}).catch(err => {
    console.log(err);
}).finally(() => {
    mongoose.connection.close();
    process.exit(0)
});