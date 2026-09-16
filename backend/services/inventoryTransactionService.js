const mongoose = require("mongoose");


const InventoryTransaction =
    require("../models/inventoryTransaction");

const Product =
    require("../models/product");

const ProductVariant =
    require("../models/productVariant");


const getAllInventoryTransactions = async ({
    page = 1,
    limit = 20,
    search = "",
    performedBy = "",
    productId = "",
    type = "",
    source = "ADMIN",
    sort = "NEWEST"
} = {}) => {

    const skip =
        (page - 1) * limit;


    const filter = {};


    // -------------------------
    // Source
    // -------------------------

    if (source === "ADMIN") {

        filter.referenceId = null;

    }

    if (source === "ORDER") {

        filter.referenceId = {
            $ne: null
        };

    }


    // -------------------------
    // Performed By
    // -------------------------

    if (performedBy) {

        if (
            !mongoose.Types.ObjectId.isValid(
                performedBy
            )
        ) {

            return {
                transactions: [],
                pagination: {
                    page,
                    limit,
                    totalItems: 0,
                    totalPages: 0
                }
            };

        }

        filter.performedBy = performedBy;
    }


    // -------------------------
    // Transaction Type
    // -------------------------

    if (type) {

        filter.type = type;

    }


    // -------------------------
    // Product
    // -------------------------

    if (productId) {

        if (
            !mongoose.Types.ObjectId.isValid(
                productId
            )
        ) {

            return {
                transactions: [],
                pagination: {
                    page,
                    limit,
                    totalItems: 0,
                    totalPages: 0
                }
            };

        }


        const variants =
            await ProductVariant.find(
                {
                    productId
                },
                {
                    _id: 1
                }
            ).lean();


        filter.productVariantId = {
            $in: variants.map(
                variant => variant._id
            )
        };

    }


    // -------------------------
    // Search
    // -------------------------

    if (search.trim()) {

        const searchRegex =
            new RegExp(
                search.trim(),
                "i"
            );


        // -------------------------
        // Matching Admins
        // -------------------------

        const admins =
            await User.find(
                {
                    role: "ADMIN",
                    $or: [
                        {
                            name: searchRegex
                        },
                        {
                            adminId: searchRegex
                        }
                    ]
                },
                {
                    _id: 1
                }
            ).lean();


        const matchingAdminIds =
            admins.map(
                admin => admin._id
            );


        // -------------------------
        // Matching Products
        // -------------------------

        const products =
            await Product.find(
                {
                    $or: [
                        {
                            name: searchRegex
                        },
                        {
                            sku: searchRegex
                        },
                        {
                            brand: searchRegex
                        }
                    ]
                },
                {
                    _id: 1
                }
            ).lean();


        const matchingProductIds =
            products.map(
                product => product._id
            );


        // -------------------------
        // Matching Variants
        // -------------------------

        const variants =
            await ProductVariant.find(
                {
                    $or: [
                        {
                            sku: searchRegex
                        },
                        {
                            color: searchRegex
                        },
                        {
                            productId: {
                                $in: matchingProductIds
                            }
                        }
                    ]
                },
                {
                    _id: 1
                }
            ).lean();


        const matchingVariantIds =
            variants.map(
                variant => variant._id
            );


        // -------------------------
        // Combine Search Results
        // -------------------------

        const searchConditions = [];


        if (matchingAdminIds.length > 0) {

            searchConditions.push({
                performedBy: {
                    $in: matchingAdminIds
                }
            });

        }


        if (matchingVariantIds.length > 0) {

            searchConditions.push({
                productVariantId: {
                    $in: matchingVariantIds
                }
            });

        }


        // Nothing matched the search
        if (searchConditions.length === 0) {

            return {
                transactions: [],
                pagination: {
                    page,
                    limit,
                    totalItems: 0,
                    totalPages: 0
                },
                stats: {
                    reservationsThisMonth: 0,
                    salesThisMonth: 0,
                    returnsThisMonth: 0,
                    salesThisWeek: 0,
                    salesToday: 0
                }
            };

        }


        filter.$or = searchConditions;

    }


    // -------------------------
    // Sort
    // -------------------------

    const sortOption =
        sort === "OLDEST"
            ? { createdAt: 1 }
            : { createdAt: -1 };


    // -------------------------
    // Transactions + Count
    // -------------------------

    const [
        transactions,
        totalItems
    ] = await Promise.all([

        InventoryTransaction.find(
            filter
        )

            .populate({
                path: "performedBy",
                select:
                    "name adminId email role"
            })

            .populate({
                path: "productVariantId",
                select:
                    "sku color price discountPrice attributes productId",

                populate: {
                    path: "productId",
                    select:
                        "name slug sku brand categoryId primarySpecification secondarySpecification",

                    populate: {
                        path: "categoryId",
                        select:
                            "name slug"
                    }
                }
            })

            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),

        InventoryTransaction.countDocuments(
            filter
        )

    ]);


    // -------------------------
    // Stats
    // -------------------------

    const now = new Date();


    const monthStart =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );


    const weekStart =
        new Date(now);

    weekStart.setDate(
        now.getDate() -
        now.getDay()
    );

    weekStart.setHours(
        0,
        0,
        0,
        0
    );


    const dayStart =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );


    const statsResult =
        await InventoryTransaction.aggregate([

            {
                $facet: {

                    reservationsThisMonth: [
                        {
                            $match: {
                                type: "RESERVATION",
                                createdAt: {
                                    $gte: monthStart
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                quantity: {
                                    $sum: "$quantity"
                                }
                            }
                        }
                    ],


                    salesThisMonth: [
                        {
                            $match: {
                                type: "SALE",
                                createdAt: {
                                    $gte: monthStart
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                quantity: {
                                    $sum: "$quantity"
                                }
                            }
                        }
                    ],


                    returnsThisMonth: [
                        {
                            $match: {
                                type: "RETURN",
                                createdAt: {
                                    $gte: monthStart
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                quantity: {
                                    $sum: "$quantity"
                                }
                            }
                        }
                    ],


                    salesThisWeek: [
                        {
                            $match: {
                                type: "SALE",
                                createdAt: {
                                    $gte: weekStart
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                quantity: {
                                    $sum: "$quantity"
                                }
                            }
                        }
                    ],


                    salesToday: [
                        {
                            $match: {
                                type: "SALE",
                                createdAt: {
                                    $gte: dayStart
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                quantity: {
                                    $sum: "$quantity"
                                }
                            }
                        }
                    ]

                }

            }

        ]);


    const stats =
        statsResult[0];


    return {

        transactions,

        pagination: {

            page,

            limit,

            totalItems,

            totalPages:
                Math.ceil(
                    totalItems / limit
                )

        },

        stats: {

            reservationsThisMonth:
                stats
                    .reservationsThisMonth[0]
                    ?.quantity || 0,

            salesThisMonth:
                stats
                    .salesThisMonth[0]
                    ?.quantity || 0,

            returnsThisMonth:
                stats
                    .returnsThisMonth[0]
                    ?.quantity || 0,

            salesThisWeek:
                stats
                    .salesThisWeek[0]
                    ?.quantity || 0,

            salesToday:
                stats
                    .salesToday[0]
                    ?.quantity || 0

        }

    };

};


module.exports = {
    getAllInventoryTransactions
};