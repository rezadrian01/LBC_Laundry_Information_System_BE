const mongoose = require('mongoose');
const { config } = require('dotenv');
const { seedAdmin } = require('./adminSeeder');
const { seedOwner } = require('./ownerSeeder');
const { seedServiceList } = require('./serviceListSeeder');
const { seedItemList } = require('./itemListSeeder');
const { seedItemService } = require('./itemServiceSeeder');
const { seedBranchList } = require('./branchSeeder');
const { seedWeightPrice } = require('./weightPriceSeeder');
const { seedStatusList } = require('./statusListSeeder');

config();
const seeder = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await seedBranchList();
    await seedServiceList();
    await seedItemList();
    await seedItemService();
    await seedWeightPrice();
    await seedStatusList();
    await seedAdmin();
    await seedOwner();
}

seeder().then(() => {
    console.log("=======================================");
    console.log("==========  Seeder finished  ==========");
    console.log("=======================================");
}).catch(err => {
    console.log(err);
}).finally(() => {
    mongoose.connection.close();
    process.exit(0);
});