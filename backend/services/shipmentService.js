const Shipment = require("../models/shipment");
const Order = require("../models/order");


const getShipment = async (orderId) => {

    const shipment = await Shipment.findOne({
        orderId
    }).populate(
        "orderId",
        "orderNumber status totalAmount"
    );

    if (!shipment) {
        const error = new Error(
            "Shipment not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return shipment;
};


const getAllShipments = async ({
    page = 1,
    limit = 10,
    search = "",
    status,
    sort = "newest"
}) => {

    const currentPage =
        Math.max(
            Number(page) || 1,
            1
        );

    const safeLimit =
        Math.min(
            Math.max(
                Number(limit) || 10,
                1
            ),
            50
        );


    // -------------------------
    // Filter
    // -------------------------

    const filter = {};


    if (status) {

        filter.status = status;

    }


    // -------------------------
    // Search
    // -------------------------

    if (search.trim()) {

        const searchValue =
            search.trim();

        filter.$or = [

            {
                orderNumber: {
                    $regex: searchValue,
                    $options: "i"
                }
            },

            {
                trackingNumber: {
                    $regex: searchValue,
                    $options: "i"
                }
            },

            {
                orderId: {
                    $in: matchingOrders.map(
                        order => order._id
                    )
                }
            }

        ];

    }


    // -------------------------
    // Sort
    // -------------------------

    let sortOption = {
        createdAt: -1
    };


    switch (sort) {

        case "oldest":

            sortOption = {
                createdAt: 1
            };

            break;


        case "newest":

        default:

            sortOption = {
                createdAt: -1
            };

            break;

    }


    // -------------------------
    // Pagination
    // -------------------------

    const skip =
        (currentPage - 1) *
        safeLimit;


    // -------------------------
    // Date Ranges
    // -------------------------

    const now = new Date();


    const startOfToday =
        new Date(now);

    startOfToday.setHours(
        0,
        0,
        0,
        0
    );


    const startOfWeek =
        new Date(now);

    const day =
        startOfWeek.getDay();

    const daysFromMonday =
        day === 0
            ? 6
            : day - 1;

    startOfWeek.setDate(
        startOfWeek.getDate() -
        daysFromMonday
    );

    startOfWeek.setHours(
        0,
        0,
        0,
        0
    );


    const sevenDaysAgo =
        new Date(now);

    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() -
        7
    );


    // -------------------------
    // Shipments
    // -------------------------

    const [
        shipments,
        totalShipments,

        pendingToday,
        packedCurrent,
        packedSevenDays,
        shippedToday,
        shippedThisWeek,
        failedToday

    ] = await Promise.all([

        Shipment.find(filter)
            .populate(
                "orderId",
                "orderNumber userId status totalAmount"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(safeLimit)
            .lean(),

        Shipment.countDocuments(filter),


        // Pending today
        Shipment.countDocuments({
            status: "PENDING",
            createdAt: {
                $gte: startOfToday,
                $lte: now
            }
        }),


        // Currently packed
        Shipment.countDocuments({
            status: "PACKED"
        }),


        // Packed for 7+ days
        Shipment.countDocuments({
            status: "PACKED",
            updatedAt: {
                $lte: sevenDaysAgo
            }
        }),


        // Shipped today
        Shipment.countDocuments({
            status: "SHIPPED",
            updatedAt: {
                $gte: startOfToday,
                $lte: now
            }
        }),


        // Shipped this week
        Shipment.countDocuments({
            status: "SHIPPED",
            updatedAt: {
                $gte: startOfWeek,
                $lte: now
            }
        }),


        // Failed today
        Shipment.countDocuments({
            status: "FAILED",
            updatedAt: {
                $gte: startOfToday,
                $lte: now
            }
        })

    ]);


    const totalPages =
        Math.ceil(
            totalShipments /
            safeLimit
        );


    return {

        shipments,

        pagination: {

            currentPage,

            totalPages,

            totalShipments,

            limit: safeLimit,

            hasNextPage:
                currentPage <
                totalPages,

            hasPreviousPage:
                currentPage > 1

        },

        stats: {

            pendingToday,

            packedCurrent,

            packedSevenDays,

            shippedToday,

            shippedThisWeek,

            failedToday

        }

    };

};

const updateShipment = async (
    shipmentId,
    {
        status,
        carrier,
        trackingNumber
    }
) => {

    const shipment =
        await Shipment.findById(
            shipmentId
        );

    if (!shipment) {
        const error = new Error(
            "Shipment not found"
        );

        error.statusCode = 404;

        throw error;
    }


    const allowedTransitions = {

        PENDING: [
            "PACKED",
            "FAILED"
        ],

        PACKED: [
            "SHIPPED",
            "FAILED"
        ],

        SHIPPED: [
            "OUT_FOR_DELIVERY",
            "FAILED"
        ],

        OUT_FOR_DELIVERY: [
            "DELIVERED",
            "FAILED"
        ],

        DELIVERED: [],

        FAILED: []

    };


    if (
        status &&
        status !== shipment.status
    ) {

        const allowed =
            allowedTransitions[
                shipment.status
            ];

        if (
            !allowed ||
            !allowed.includes(status)
        ) {

            const error = new Error(
                `Cannot change shipment status from ${shipment.status} to ${status}`
            );

            error.statusCode = 400;

            throw error;
        }

        shipment.status = status;


        if (status === "SHIPPED") {

            shipment.shippedAt =
                new Date();

        }


        if (status === "DELIVERED") {

            shipment.deliveredAt =
                new Date();

        }

    }


    // Carrier can be added/changed independently
    if (carrier !== undefined) {

        shipment.carrier = carrier;

    }


    // Tracking number can be added/changed independently
    if (trackingNumber !== undefined) {

        shipment.trackingNumber =
            trackingNumber;

    }


    await shipment.save();

    return shipment;
};


const calculateShippingCharge = async ({
    userId,
    subtotal
}) => {

    const previousOrder = await Order.exists({
        userId,
        status: {
            $ne: "CANCELLED"
        }
    });


    // First order gets free delivery
    if (!previousOrder) {
        return 0;
    }


    // Free delivery for orders of ₹1,000 or more
    if (subtotal >= 1000) {
        return 0;
    }


    // Normal delivery charge
    return 50;
};



module.exports = {
    getShipment,
    getAllShipments,
    updateShipment,
    calculateShippingCharge
};