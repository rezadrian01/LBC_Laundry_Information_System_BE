const { STATUS_LIST } = require('../constants/statusList');
const StatusList = require('../models/StatusList');

const seedStatusList = async () => {
    await StatusList.deleteMany({});

    for (const status of STATUS_LIST) {
        const newStatus = new StatusList({
            name: status.name
        })
        await newStatus.save();
    }
    console.log("Status list created")
}

module.exports = { seedStatusList }