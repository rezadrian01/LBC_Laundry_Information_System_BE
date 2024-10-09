const Laundry = require('../models/Laundry');
const LaundryService = require('../models/LaundryService');
const ServiceList = require('../models/ServiceList');
const ItemType = require('../models/itemType');
const LaundryStatus = require('../models/LaundryStatus');
const WeightPrice = require('../models/WeightPrice');
const ItemService = require('../models/ItemService');
const { errorHelper, responseHelper } = require('../helpers/responseHelper');
const StatusList = require('../models/StatusList');

const getLaundryListWithArchive = async (request, res, next) => {
    try {
        const laundryList = await Laundry.aggregate([
            // laundry branch
            {
                $lookup: {
                    from: 'branchlists',
                    localField: 'branchId',
                    foreignField: '_id',
                    as: 'branch'
                }
            },
            {
                $project: {
                    branchId: 0
                }
            },
            {
                $unwind: {
                    path: '$branch'
                }
            },

            // laundry services
            {
                $lookup: {
                    from: 'laundryservices',
                    localField: '_id',
                    foreignField: 'laundryId',
                    as: 'laundryServices'
                }
            },
            {
                $lookup: {
                    from: 'servicelists',
                    localField: 'laundryServices.serviceId',
                    foreignField: '_id',
                    as: 'laundryServices'
                }
            },

            // item type
            {
                $lookup: {
                    from: 'itemtypes',
                    localField: '_id',
                    foreignField: 'laundryId',
                    as: 'tempItemType'
                }
            },

            // combine item type
            {
                $addFields: {
                    items: {
                        $map: {
                            input: '$tempItemType',
                            as: 'tempItemType',
                            in: {
                                itemServiceId: '$$tempItemType.itemServiceId',
                                quantity: '$$tempItemType.quantity'
                            }
                        }
                    }
                }
            },

            // get item services with current item serviceId
            {
                $lookup: {
                    from: 'itemservices',
                    localField: 'items.itemServiceId',
                    foreignField: '_id',
                    as: 'tempItemServices'
                }
            },

            // merge itemType with itemService
            {
                $addFields: {
                    mergeItemService: {
                        $map: {
                            input: '$items',
                            as: 'items',
                            in: {
                                itemServiceId: '$$items.itemServiceId',
                                quantity: '$$items.quantity',
                                serviceDetail: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$tempItemServices',
                                                as: 'tempItemServices',
                                                cond: { $eq: ['$$tempItemServices._id', '$$items.itemServiceId'] }
                                            }
                                        }, 0
                                    ]
                                }
                            }
                        }
                    }
                }
            },

            {
                $project: {
                    tempItemServices: 0
                }
            },

            // get all item detail with itemId in mergeItemServiceField
            {
                $lookup: {
                    from: 'itemlists',
                    localField: 'mergeItemService.serviceDetail.itemId',
                    foreignField: '_id',
                    as: 'itemLists'
                }
            },

            // merge all item list to existing merge itemType and itemService
            {
                $addFields: {
                    itemsResult: {
                        $map: {
                            input: '$mergeItemService',
                            as: 'mergeItemService',
                            in: {
                                itemServiceId: '$$mergeItemService.itemServiceId',
                                quantity: '$$mergeItemService.quantity',
                                itemServiceName: '$$mergeItemService.serviceDetail.name',
                                itemServicePrice: '$$mergeItemService.serviceDetail.price',
                                itemDetail: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$itemLists',
                                                as: 'itemLists',
                                                cond: { $eq: ['$$mergeItemService.serviceDetail.itemId', '$$itemLists._id'] }
                                            }
                                        }, 0
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    itemLists: 0,
                    items: 0,
                    tempItemType: 0,
                    mergeItemService: 0
                }
            },



            // laundry status
            {
                $lookup: {
                    from: 'laundrystatuses',
                    localField: '_id',
                    foreignField: 'laundryId',
                    as: 'status'
                }
            },

            {
                $lookup: {
                    from: 'statuslists',
                    localField: 'status.statusId',
                    foreignField: '_id',
                    as: 'status'
                }
            },

            {
                $unwind: {
                    path: '$status'
                }
            }
        ])

        responseHelper(res, "Success get all laundry", 200, true, laundryList)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getLaundryList = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getLaundryDetail = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const getLaundryInfo = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    }
}

const createLaundry = async (req, res, next) => {
    try {
        const { receiptNumber, branchId, weight, items, totalItems, customerName, customerAddress, customerContact, isPaidOff, services, isWeight } = req.body;

        const newLaundry = new Laundry({
            receiptNumber: receiptNumber,
            branchId: branchId,
            customerName: customerName,
            customerAddress: customerAddress || "",
            customerContact: customerContact || "",
            isPaidOff: isPaidOff,
        })

        let totalPrice = 0;
        const itemServiceList = [];

        if (isWeight == 'true') {
            if (!weight) errorHelper("Weight must be exist", 422);
            const prices = await WeightPrice.find().sort({ maxWeight: 1 });

            // search price for current weight
            for (const price of prices) {
                if (+weight <= price.maxWeight) {
                    totalPrice = price.price;
                    break;
                }
            }

            // add weight and total items field to new laundry
            newLaundry.weight = weight;
            if (totalItems) newLaundry.totalItems = totalItems;
        }
        else {
            if (!items) errorHelper("Items must be exist", 422);
            let tempTotalItems = 0;
            const promises = Object.keys(items).map(async (key) => {

                // temporary item service list
                itemServiceList.push({ ...items[key] });

                // calculate total items
                tempTotalItems += +items[key].quantity;

                // search existing item service to get the price
                const existingItemService = await ItemService.findById(items[key].itemServiceId);
                if (!existingItemService) errorHelper("Item service not found", 404);

                return existingItemService.price * items[key].quantity;
            })

            const subtotals = await Promise.all(promises);
            totalPrice = subtotals.reduce((total, subtotal) => total + subtotal, 0);

            // add totalItems field to new laundry
            newLaundry.totalItems = tempTotalItems;

            // add weight field if exist
            if (weight) newLaundry.weight = weight;

        }
        // add totalPrice field to new laundry
        newLaundry.totalPrice = totalPrice;
        const createdLaundry = await newLaundry.save();

        // service laundry
        for (const key of Object.keys(services)) {
            const existingService = await ServiceList.findById(services[key].id)
            if (!existingService) errorHelper("Service not found", 404);

            const newLaundryService = new LaundryService({
                laundryId: createdLaundry,
                serviceId: existingService
            })
            await newLaundryService.save();
        }

        // item type
        if (isWeight == 'false') {
            for (const itemType of itemServiceList) {
                const newItemType = new ItemType({
                    laundryId: createdLaundry,
                    itemServiceId: itemType.itemServiceId,
                    quantity: itemType.quantity
                })
                await newItemType.save();
            }
        }

        // laundry status
        const existingStatusList = await StatusList.findOne({ name: "Diterima" });
        const newLaundryStatus = new LaundryStatus({
            laundryId: createdLaundry,
            statusId: existingStatusList,
        })
        await newLaundryStatus.save();

        responseHelper(res, "Success create new laundry", 201, true)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const updateLaundry = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const deleteLaundry = async (req, res, next) => {
    try {

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports = { getLaundryListWithArchive, getLaundryList, getLaundryDetail, getLaundryInfo, createLaundry, updateLaundry, deleteLaundry }