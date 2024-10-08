const { BRANCH_LIST } = require('../constants/branchList');
const Branch = require('../models/BranchList');

const seedBranchList = async () => {
    await Branch.deleteMany({});

    for (const branch of BRANCH_LIST) {
        const newBranch = new Branch({
            name: branch.name,
            address: branch.address
        })
        await newBranch.save();
    }
    console.log("Branch list created")
}

module.exports = { seedBranchList }