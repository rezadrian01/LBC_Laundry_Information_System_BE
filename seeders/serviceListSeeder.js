const ServiceList = require('../models/ServiceList');
const { config } = require('dotenv');
const { SERVICE_LIST } = require('../constants/serviceList');

const seedServiceList = async () => {
    await ServiceList.deleteMany({});

    for (const service of SERVICE_LIST) {
        const newService = new ServiceList({
            name: service.name,
            price: service.price
        })
        await newService.save();
    }
    console.log("Service list created")
}

module.exports = { seedServiceList }