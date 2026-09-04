const Return = require("../models/return");
const Order = require("../models/order");


const createReturn = async (
    userId,
    orderId,
    items
) => {

    const order = await Order.findOne({
        _id: orderId,
        userId
    });

    if (!order) {
        const error = new Error(
            "Order not found"
        );
        error.statusCode = 404;
        throw error;
    }


    if (order.status !== "DELIVERED") {
        const error = new Error(
            "Only delivered orders can be returned"
        );
        error.statusCode = 400;
        throw error;
    }


    if (
        order.returnDeadline &&
        new Date() > order.returnDeadline
    ) {
        const error = new Error(
            "Return period has expired"
        );
        error.statusCode = 400;
        throw error;
    }


    if (!Array.isArray(items) || items.length === 0) {
        const error = new Error(
            "At least one item is required for return"
        );
        error.statusCode = 400;
        throw error;
    }


    const existingReturns = await Return.find({
        orderId,
        status: {
            $nin: [
                "REJECTED",
                "CANCELLED"
            ]
        }
    });


    const returnedQuantities = {};


    for (const returnRequest of existingReturns) {

        for (const item of returnRequest.items) {

            const key =
                item.productVariantId.toString();

            returnedQuantities[key] =
                (returnedQuantities[key] || 0) +
                item.quantity;
        }
    }


    const returnItems = [];


    for (const item of items) {

        const orderItem = order.items.find(
            orderItem =>
                orderItem.productVariantId.toString() ===
                item.productVariantId.toString()
        );


        if (!orderItem) {
            const error = new Error(
                "One or more items do not belong to this order"
            );
            error.statusCode = 400;
            throw error;
        }


        const alreadyReturned =
            returnedQuantities[
                item.productVariantId.toString()
            ] || 0;


        const remainingQuantity =
            orderItem.quantity -
            alreadyReturned;


        if (item.quantity > remainingQuantity) {
            const error = new Error(
                `Only ${remainingQuantity} units of ${orderItem.sku} can be returned`
            );
            error.statusCode = 400;
            throw error;
        }


        returnItems.push({
            productVariantId:
                orderItem.productVariantId,

            quantity:
                item.quantity,

            reason:
                item.reason
        });
    }


    const returnRequest = await Return.create({
        userId,
        orderId,
        items: returnItems,
        status: "REQUESTED",
        requestedAt: new Date()
    });


    return returnRequest;
};


const getMyReturns = async (userId) => {

    return Return.find({
        userId
    })
        .populate(
            "orderId",
            "orderNumber status totalAmount"
        )
        .sort({
            createdAt: -1
        });
};


const getReturn = async (userId, returnId) => {

    const returnRequest = await Return.findOne({
        _id: returnId,
        userId
    })
        .populate(
            "orderId",
            "orderNumber status totalAmount"
        )
        .populate(
            "items.productVariantId",
            "sku"
        );

    if (!returnRequest) {
        const error = new Error(
            "Return request not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return returnRequest;
};


const getAllReturns = async () => {

    return Return.find()
        .populate(
            "orderId",
            "orderNumber userId status totalAmount"
        )
        .populate(
            "userId",
            "name email"
        )
        .sort({
            createdAt: -1
        });
};


const updateReturn = async (
    returnId,
    {
        status,
        adminNotes
    }
) => {

    const returnRequest = await Return.findById(
        returnId
    );

    if (!returnRequest) {
        const error = new Error(
            "Return request not found"
        );
        error.statusCode = 404;
        throw error;
    }


    const allowedTransitions = {

        REQUESTED: [
            "APPROVED",
            "REJECTED",
            "CANCELLED"
        ],

        APPROVED: [
            "PICKUP_SCHEDULED"
        ],

        PICKUP_SCHEDULED: [
            "RECEIVED"
        ],

        RECEIVED: [
            "REFUNDED"
        ],

        REJECTED: [],

        CANCELLED: [],

        REFUNDED: []
    };


    if (
        status &&
        status !== returnRequest.status
    ) {

        const allowed =
            allowedTransitions[
                returnRequest.status
            ];

        if (
            !allowed ||
            !allowed.includes(status)
        ) {
            const error = new Error(
                `Cannot change return status from ${returnRequest.status} to ${status}`
            );
            error.statusCode = 400;
            throw error;
        }

        returnRequest.status = status;


        if (status === "APPROVED") {
            returnRequest.approvedAt =
                new Date();
        }


        if (status === "RECEIVED") {
            returnRequest.receivedAt =
                new Date();
        }


        if (status === "REFUNDED") {
            returnRequest.refundedAt =
                new Date();
        }
    }


    if (adminNotes !== undefined) {
        returnRequest.adminNotes =
            adminNotes;
    }


    await returnRequest.save();

    return returnRequest;
};


module.exports = {
    createReturn,
    getMyReturns,
    getReturn,
    getAllReturns,
    updateReturn
};