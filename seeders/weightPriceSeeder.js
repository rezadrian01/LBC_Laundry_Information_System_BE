const { WEIGHT_PRICE_LIST } = require('../constants/weightPriceList');
const WeightPrice = require('../models/WeightPrice');

const seedWeightPrice = async () => {
    await WeightPrice.deleteMany({});

    for (const weight of WEIGHT_PRICE_LIST) {
        const newWeightPrice = new WeightPrice({
            maxWeight: weight.maxWeight,
            price: weight.price
        })
        await newWeightPrice.save();
    }
    console.log("Weight price list created");
}

module.exports = { seedWeightPrice }