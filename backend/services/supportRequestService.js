const SupportRequest = require("../models/supportRequest");
const Order = require("../models/order");


const createSupportRequest = async ({
    userId,
    subject,
    message,
    category,
    orderId
}) => {

    if (orderId) {

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
    }


    const supportRequest =
        await SupportRequest.create({
            userId,
            subject,
            message,
            category,
            orderId: orderId || null
        });


    return supportRequest;
};


const getMySupportRequests = async (userId) => {

    return SupportRequest.find({
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


const getSupportRequest = async (
    userId,
    supportRequestId
) => {

    const supportRequest =
        await SupportRequest.findOne({
            _id: supportRequestId,
            userId
        })
            .populate(
                "orderId",
                "orderNumber status totalAmount"
            );

    if (!supportRequest) {
        const error = new Error(
            "Support request not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return supportRequest;
};


const closeSupportRequest = async (
    userId,
    supportRequestId
) => {

    const supportRequest =
        await SupportRequest.findOne({
            _id: supportRequestId,
            userId
        });

    if (!supportRequest) {
        const error = new Error(
            "Support request not found"
        );
        error.statusCode = 404;
        throw error;
    }


    if (
        supportRequest.status === "CLOSED"
    ) {
        return supportRequest;
    }


    if (
        supportRequest.status !== "RESOLVED"
    ) {
        const error = new Error(
            "Only resolved support requests can be closed"
        );
        error.statusCode = 400;
        throw error;
    }


    supportRequest.status = "CLOSED";

    await supportRequest.save();


    return supportRequest;
};


const getAllSupportRequests = async () => {

    return SupportRequest.find()
        .populate(
            "userId",
            "name email"
        )
        .populate(
            "orderId",
            "orderNumber status totalAmount"
        )
        .sort({
            createdAt: -1
        });
};


const updateSupportRequest = async (
    supportRequestId,
    {
        status,
        adminResponse
    }
) => {

    const supportRequest =
        await SupportRequest.findById(
            supportRequestId
        );

    if (!supportRequest) {
        const error = new Error(
            "Support request not found"
        );
        error.statusCode = 404;
        throw error;
    }


    const allowedTransitions = {
        TICKET_RAISED: ["OPEN"],
        OPEN: ["IN_PROGRESS"],
        IN_PROGRESS: ["RESOLVED"],
        RESOLVED: ["CLOSED"],
        CLOSED: []
    };


    if (
        status &&
        status !== supportRequest.status
    ) {

        const allowed =
            allowedTransitions[
                supportRequest.status
            ];

        if (
            !allowed ||
            !allowed.includes(status)
        ) {
            const error = new Error(
                `Cannot change support request status from ${supportRequest.status} to ${status}`
            );
            error.statusCode = 400;
            throw error;
        }

        supportRequest.status = status;


        if (status === "RESOLVED") {
            supportRequest.resolvedAt =
                new Date();
        }
    }


    if (adminResponse !== undefined) {
        supportRequest.adminResponse =
            adminResponse || null;
    }


    await supportRequest.save();


    return supportRequest;
};


module.exports = {
    createSupportRequest,
    getMySupportRequests,
    getSupportRequest,
    closeSupportRequest,
    getAllSupportRequests,
    updateSupportRequest
};