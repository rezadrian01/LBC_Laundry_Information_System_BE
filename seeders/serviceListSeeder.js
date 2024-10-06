const ServiceList = require('../models/ServiceList');
const { config } = require('dotenv');
const { SERVICE_LIST } = require('../constants/serviceList');

const seedServiceList = async () => {
    const serviceList = await ServiceList.find();
    if (serviceList.length !== SERVICE_LIST.length) await ServiceList.deleteMany({});

    for (const service of SERVICE_LIST) {
        const newService = new ServiceList({
            name: service.name
        })
        await newService.save();
    }
    console.log("Service list created")
}

module.exports = { seedServiceList }