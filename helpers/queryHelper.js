const GET_LAUNDRY_LIST = [
    // laundry branch
    {
        $lookup: {
            from: "branchlists",
            localField: "branchId",
            foreignField: "_id",
            as: "branch"
        }
    },
    {
        $project: {
            branchId: 0
        }
    },
    {
        $unwind: {
            path: "$branch"
        }
    },
    // laundry services
    {
        $lookup: {
            from: "laundryservices",
            localField: "_id",
            foreignField: "laundryId",
            as: "laundryServices"
        }
    },
    {
        $lookup: {
            from: "servicelists",
            localField: "laundryServices.serviceId",
            foreignField: "_id",
            as: "laundryServices"
        }
    },
    // item type
    {
        $lookup: {
            from: "itemtypes",
            localField: "_id",
            foreignField: "laundryId",
            as: "tempItemType"
        }
    },
    // combine item type
    {
        $addFields: {
            items: {
                $map: {
                    input: "$tempItemType",
                    as: "tempItemType",
                    in: {
                        itemServiceId:
                            "$$tempItemType.itemServiceId",
                        quantity: "$$tempItemType.quantity"
                    }
                }
            }
        }
    },
    // get item services with current item serviceId
    {
        $lookup: {
            from: "itemservices",
            localField: "items.itemServiceId",
            foreignField: "_id",
            as: "tempItemServices"
        }
    },
    // merge itemType with itemService
    {
        $addFields: {
            mergeItemService: {
                $map: {
                    input: "$items",
                    as: "items",
                    in: {
                        itemServiceId:
                            "$$items.itemServiceId",
                        quantity: "$$items.quantity",
                        serviceDetail: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$tempItemServices",
                                        as: "tempItemServices",
                                        cond: {
                                            $eq: [
                                                "$$tempItemServices._id",
                                                "$$items.itemServiceId"
                                            ]
                                        }
                                    }
                                },
                                0
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
            from: "itemlists",
            localField:
                "mergeItemService.serviceDetail.itemId",
            foreignField: "_id",
            as: "itemLists"
        }
    },
    // merge all item list to existing merge itemType and itemService
    {
        $addFields: {
            itemServices: {
                $map: {
                    input: "$mergeItemService",
                    as: "mergeItemService",
                    in: {
                        itemServiceId:
                            "$$mergeItemService.itemServiceId",
                        quantity:
                            "$$mergeItemService.quantity",
                        itemServiceName:
                            "$$mergeItemService.serviceDetail.name",
                        itemServicePrice:
                            "$$mergeItemService.serviceDetail.price",
                        itemDetail: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$itemLists",
                                        as: "itemLists",
                                        cond: {
                                            $eq: [
                                                "$$mergeItemService.serviceDetail.itemId",
                                                "$$itemLists._id"
                                            ]
                                        }
                                    }
                                },
                                0
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
            from: "laundrystatuses",
            localField: "_id",
            foreignField: "laundryId",
            as: "status"
        }
    },
    {
        $lookup: {
            from: "statuslists",
            localField: "status.statusId",
            foreignField: "_id",
            as: "status"
        }
    },
    {
        $unwind: {
            path: "$status"
        }
    }
]

const GET_LAUNDRY_LIST_UNARCHIVED = [
    {
        $match: {
            isArchive: false
        }
    },
    // laundry branch
    {
        $lookup: {
            from: "branchlists",
            localField: "branchId",
            foreignField: "_id",
            as: "branch"
        }
    },
    {
        $project: {
            branchId: 0
        }
    },
    {
        $unwind: {
            path: "$branch"
        }
    },
    // laundry services
    {
        $lookup: {
            from: "laundryservices",
            localField: "_id",
            foreignField: "laundryId",
            as: "laundryServices"
        }
    },
    {
        $lookup: {
            from: "servicelists",
            localField: "laundryServices.serviceId",
            foreignField: "_id",
            as: "laundryServices"
        }
    },
    // item type
    {
        $lookup: {
            from: "itemtypes",
            localField: "_id",
            foreignField: "laundryId",
            as: "tempItemType"
        }
    },
    // combine item type
    {
        $addFields: {
            items: {
                $map: {
                    input: "$tempItemType",
                    as: "tempItemType",
                    in: {
                        itemServiceId:
                            "$$tempItemType.itemServiceId",
                        quantity: "$$tempItemType.quantity"
                    }
                }
            }
        }
    },
    // get item services with current item serviceId
    {
        $lookup: {
            from: "itemservices",
            localField: "items.itemServiceId",
            foreignField: "_id",
            as: "tempItemServices"
        }
    },
    // merge itemType with itemService
    {
        $addFields: {
            mergeItemService: {
                $map: {
                    input: "$items",
                    as: "items",
                    in: {
                        itemServiceId:
                            "$$items.itemServiceId",
                        quantity: "$$items.quantity",
                        serviceDetail: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$tempItemServices",
                                        as: "tempItemServices",
                                        cond: {
                                            $eq: [
                                                "$$tempItemServices._id",
                                                "$$items.itemServiceId"
                                            ]
                                        }
                                    }
                                },
                                0
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
            from: "itemlists",
            localField:
                "mergeItemService.serviceDetail.itemId",
            foreignField: "_id",
            as: "itemLists"
        }
    },
    // merge all item list to existing merge itemType and itemService
    {
        $addFields: {
            itemServices: {
                $map: {
                    input: "$mergeItemService",
                    as: "mergeItemService",
                    in: {
                        itemServiceId:
                            "$$mergeItemService.itemServiceId",
                        quantity:
                            "$$mergeItemService.quantity",
                        itemServiceName:
                            "$$mergeItemService.serviceDetail.name",
                        itemServicePrice:
                            "$$mergeItemService.serviceDetail.price",
                        itemDetail: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$itemLists",
                                        as: "itemLists",
                                        cond: {
                                            $eq: [
                                                "$$mergeItemService.serviceDetail.itemId",
                                                "$$itemLists._id"
                                            ]
                                        }
                                    }
                                },
                                0
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
            from: "laundrystatuses",
            localField: "_id",
            foreignField: "laundryId",
            as: "status"
        }
    },
    {
        $lookup: {
            from: "statuslists",
            localField: "status.statusId",
            foreignField: "_id",
            as: "status"
        }
    },
    {
        $unwind: {
            path: "$status"
        }
    }
]

const GET_LAUNDRY_LIST_ARCHIVED = [
    {
        $match: {
            isArchive: true
        }
    },
    // laundry branch
    {
        $lookup: {
            from: "branchlists",
            localField: "branchId",
            foreignField: "_id",
            as: "branch"
        }
    },
    {
        $project: {
            branchId: 0
        }
    },
    {
        $unwind: {
            path: "$branch"
        }
    },
    // laundry services
    {
        $lookup: {
            from: "laundryservices",
            localField: "_id",
            foreignField: "laundryId",
            as: "laundryServices"
        }
    },
    {
        $lookup: {
            from: "servicelists",
            localField: "laundryServices.serviceId",
            foreignField: "_id",
            as: "laundryServices"
        }
    },
    // item type
    {
        $lookup: {
            from: "itemtypes",
            localField: "_id",
            foreignField: "laundryId",
            as: "tempItemType"
        }
    },
    // combine item type
    {
        $addFields: {
            items: {
                $map: {
                    input: "$tempItemType",
                    as: "tempItemType",
                    in: {
                        itemServiceId:
                            "$$tempItemType.itemServiceId",
                        quantity: "$$tempItemType.quantity"
                    }
                }
            }
        }
    },
    // get item services with current item serviceId
    {
        $lookup: {
            from: "itemservices",
            localField: "items.itemServiceId",
            foreignField: "_id",
            as: "tempItemServices"
        }
    },
    // merge itemType with itemService
    {
        $addFields: {
            mergeItemService: {
                $map: {
                    input: "$items",
                    as: "items",
                    in: {
                        itemServiceId:
                            "$$items.itemServiceId",
                        quantity: "$$items.quantity",
                        serviceDetail: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$tempItemServices",
                                        as: "tempItemServices",
                                        cond: {
                                            $eq: [
                                                "$$tempItemServices._id",
                                                "$$items.itemServiceId"
                                            ]
                                        }
                                    }
                                },
                                0
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
            from: "itemlists",
            localField:
                "mergeItemService.serviceDetail.itemId",
            foreignField: "_id",
            as: "itemLists"
        }
    },
    // merge all item list to existing merge itemType and itemService
    {
        $addFields: {
            itemServices: {
                $map: {
                    input: "$mergeItemService",
                    as: "mergeItemService",
                    in: {
                        itemServiceId:
                            "$$mergeItemService.itemServiceId",
                        quantity:
                            "$$mergeItemService.quantity",
                        itemServiceName:
                            "$$mergeItemService.serviceDetail.name",
                        itemServicePrice:
                            "$$mergeItemService.serviceDetail.price",
                        itemDetail: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$itemLists",
                                        as: "itemLists",
                                        cond: {
                                            $eq: [
                                                "$$mergeItemService.serviceDetail.itemId",
                                                "$$itemLists._id"
                                            ]
                                        }
                                    }
                                },
                                0
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
            from: "laundrystatuses",
            localField: "_id",
            foreignField: "laundryId",
            as: "status"
        }
    },
    {
        $lookup: {
            from: "statuslists",
            localField: "status.statusId",
            foreignField: "_id",
            as: "status"
        }
    },
    {
        $unwind: {
            path: "$status"
        }
    }
]

const GET_LAUNDRY_BY_RECEIPT_NUMBER = (receiptNumber) => {
    return [
        {
            $match: {
                receiptNumber: receiptNumber
            }
        },
        // laundry branch
        {
            $lookup: {
                from: "branchlists",
                localField: "branchId",
                foreignField: "_id",
                as: "branch"
            }
        },
        {
            $project: {
                branchId: 0
            }
        },
        {
            $unwind: {
                path: "$branch"
            }
        },
        // laundry services
        {
            $lookup: {
                from: "laundryservices",
                localField: "_id",
                foreignField: "laundryId",
                as: "laundryServices"
            }
        },
        {
            $lookup: {
                from: "servicelists",
                localField: "laundryServices.serviceId",
                foreignField: "_id",
                as: "laundryServices"
            }
        },
        // item type
        {
            $lookup: {
                from: "itemtypes",
                localField: "_id",
                foreignField: "laundryId",
                as: "tempItemType"
            }
        },
        // combine item type
        {
            $addFields: {
                items: {
                    $map: {
                        input: "$tempItemType",
                        as: "tempItemType",
                        in: {
                            itemServiceId:
                                "$$tempItemType.itemServiceId",
                            quantity: "$$tempItemType.quantity"
                        }
                    }
                }
            }
        },
        // get item services with current item serviceId
        {
            $lookup: {
                from: "itemservices",
                localField: "items.itemServiceId",
                foreignField: "_id",
                as: "tempItemServices"
            }
        },
        // merge itemType with itemService
        {
            $addFields: {
                mergeItemService: {
                    $map: {
                        input: "$items",
                        as: "items",
                        in: {
                            itemServiceId:
                                "$$items.itemServiceId",
                            quantity: "$$items.quantity",
                            serviceDetail: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$tempItemServices",
                                            as: "tempItemServices",
                                            cond: {
                                                $eq: [
                                                    "$$tempItemServices._id",
                                                    "$$items.itemServiceId"
                                                ]
                                            }
                                        }
                                    },
                                    0
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
                from: "itemlists",
                localField:
                    "mergeItemService.serviceDetail.itemId",
                foreignField: "_id",
                as: "itemLists"
            }
        },
        // merge all item list to existing merge itemType and itemService
        {
            $addFields: {
                itemServices: {
                    $map: {
                        input: "$mergeItemService",
                        as: "mergeItemService",
                        in: {
                            itemServiceId:
                                "$$mergeItemService.itemServiceId",
                            quantity:
                                "$$mergeItemService.quantity",
                            itemServiceName:
                                "$$mergeItemService.serviceDetail.name",
                            itemServicePrice:
                                "$$mergeItemService.serviceDetail.price",
                            itemDetail: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$itemLists",
                                            as: "itemLists",
                                            cond: {
                                                $eq: [
                                                    "$$mergeItemService.serviceDetail.itemId",
                                                    "$$itemLists._id"
                                                ]
                                            }
                                        }
                                    },
                                    0
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
                from: "laundrystatuses",
                localField: "_id",
                foreignField: "laundryId",
                as: "status"
            }
        },
        {
            $lookup: {
                from: "statuslists",
                localField: "status.statusId",
                foreignField: "_id",
                as: "status"
            }
        },
        {
            $unwind: {
                path: "$status"
            }
        }
    ]
}

const GET_LAUNDRY_BY_STATUS = (statusId) => {
    return [
        {
            $match: {
                statusId: statusId
            }
        },
        {
            $lookup: {
                from: 'statuslists',
                localField: 'statusId',
                foreignField: '_id',
                as: 'status'
            }
        },
        {
            $unwind: {
                path: '$status'
            }
        },

        {
            $lookup: {
                from: 'laundries',
                localField: 'laundryId',
                foreignField: '_id',
                as: 'laundry'
            }
        },

        {
            $project: {
                laundryId: 0
            }
        },

        {
            $unwind: {
                path: '$laundry'
            }
        },


        {
            $lookup: {
                from: "branchlists",
                localField: "laundry.branchId",
                foreignField: "_id",
                as: "branch"
            }
        },
        {
            $project: {
                branchId: 0
            }
        },
        {
            $unwind: {
                path: "$branch"
            }
        },
        //laundry services
        {
            $lookup: {
                from: "laundryservices",
                localField: "laundry._id",
                foreignField: "laundryId",
                as: "laundryServices"
            }
        },
        {
            $lookup: {
                from: "servicelists",
                localField: "laundryServices.serviceId",
                foreignField: "_id",
                as: "laundryServices"
            }
        },
        // // item type
        {
            $lookup: {
                from: "itemtypes",
                localField: "laundry._id",
                foreignField: "laundryId",
                as: "tempItemType"
            }
        },
        // combine item type
        {
            $addFields: {
                items: {
                    $map: {
                        input: "$tempItemType",
                        as: "tempItemType",
                        in: {
                            itemServiceId:
                                "$$tempItemType.itemServiceId",
                            quantity: "$$tempItemType.quantity"
                        }
                    }
                }
            }
        },
        // get item services with current item serviceId
        {
            $lookup: {
                from: "itemservices",
                localField: "items.itemServiceId",
                foreignField: "_id",
                as: "tempItemServices"
            }
        },
        // merge itemType with itemService
        {
            $addFields: {
                mergeItemService: {
                    $map: {
                        input: "$items",
                        as: "items",
                        in: {
                            itemServiceId:
                                "$$items.itemServiceId",
                            quantity: "$$items.quantity",
                            serviceDetail: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$tempItemServices",
                                            as: "tempItemServices",
                                            cond: {
                                                $eq: [
                                                    "$$tempItemServices._id",
                                                    "$$items.itemServiceId"
                                                ]
                                            }
                                        }
                                    },
                                    0
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
                from: "itemlists",
                localField:
                    "mergeItemService.serviceDetail.itemId",
                foreignField: "_id",
                as: "itemLists"
            }
        },
        // merge all item list to existing merge itemType and itemService
        {
            $addFields: {
                itemServices: {
                    $map: {
                        input: "$mergeItemService",
                        as: "mergeItemService",
                        in: {
                            itemServiceId:
                                "$$mergeItemService.itemServiceId",
                            quantity:
                                "$$mergeItemService.quantity",
                            itemServiceName:
                                "$$mergeItemService.serviceDetail.name",
                            itemServicePrice:
                                "$$mergeItemService.serviceDetail.price",
                            itemDetail: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$itemLists",
                                            as: "itemLists",
                                            cond: {
                                                $eq: [
                                                    "$$mergeItemService.serviceDetail.itemId",
                                                    "$$itemLists._id"
                                                ]
                                            }
                                        }
                                    },
                                    0
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

    ]
}

const GET_TOTAL_INCOME_AND_TOTAL_TRANSACTION_FROM_LAUNDRY = (startDate, endDate, branchId = null) => {
    return [
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },

        {
            $group: {
                _id: branchId,
                totalIncome: { $sum: '$totalPrice' },
                totalTransactions: { $sum: 1 }
            }
        }
    ]
}

module.exports = { GET_LAUNDRY_LIST, GET_LAUNDRY_LIST_UNARCHIVED, GET_LAUNDRY_LIST_ARCHIVED, GET_LAUNDRY_BY_RECEIPT_NUMBER, GET_LAUNDRY_BY_STATUS, GET_TOTAL_INCOME_AND_TOTAL_TRANSACTION_FROM_LAUNDRY }