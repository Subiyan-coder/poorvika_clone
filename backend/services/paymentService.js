const Payment = require("../models/payment");
const Order = require("../models/order");


const createPayment = async (
    userId,
    orderId,
    method
) => {

    const order = await Order.findOne({
        _id: orderId,
        userId
    });

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }


    if (order.status === "CANCELLED") {
        const error = new Error(
            "Payment cannot be created for a cancelled order"
        );
        error.statusCode = 400;
        throw error;
    }


    const existingPayment = await Payment.findOne({
        orderId
    });

    if (existingPayment) {
        const error = new Error(
            "Payment already exists for this order"
        );
        error.statusCode = 409;
        throw error;
    }


    const payment = await Payment.create({
        orderId,
        orderNumber: order.orderNumber,
        method,
        amount: order.totalAmount,
        status: "PENDING"
    });

    if (method === "COD") {
        order.status = "CONFIRMED";
        await order.save();
    }


    return payment;
};


const getMyPayment = async (
    userId,
    orderId
) => {

    const order = await Order.findOne({
        _id: orderId,
        userId
    });

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }


    const payment = await Payment.findOne({
        orderId
    });

    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }


    return payment;
};


const getPaymentForAdmin = async (
    orderId
) => {

    const payment = await Payment.findOne({
        orderId
    }).populate(
        "orderId",
        "orderNumber userId totalAmount status"
    );

    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }


    return payment;
};


const getAllAdminPayments = async ({
    page = 1,
    limit = 10,
    search = "",
    status,
    method,
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


    if (method) {

        filter.method = method;

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
                transactionId: {
                    $regex: searchValue,
                    $options: "i"
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


        case "highestAmount":

            sortOption = {
                amount: -1
            };

            break;


        case "lowestAmount":

            sortOption = {
                amount: 1
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
    // Payments
    // -------------------------

    const [
        payments,
        totalPayments
    ] = await Promise.all([

        Payment.find(filter)
            .populate(
                "orderId",
                "orderNumber userId totalAmount status"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(safeLimit)
            .lean(),

        Payment.countDocuments(filter)

    ]);


    // -------------------------
    // Stats
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


    const endOfToday =
        new Date(now);

    endOfToday.setHours(
        23,
        59,
        59,
        999
    );


    const [
        paidToday,
        pending,
        failedToday,
        refunded
    ] = await Promise.all([

        Payment.countDocuments({

            status: "PAID",

            paidAt: {
                $gte: startOfToday,
                $lte: endOfToday
            }

        }),


        Payment.countDocuments({

            status: "PENDING"

        }),


        Payment.countDocuments({

            status: "FAILED",

            updatedAt: {
                $gte: startOfToday,
                $lte: endOfToday
            }

        }),


        Payment.countDocuments({

            status: "REFUNDED"

        })

    ]);


    // -------------------------
    // Pagination
    // -------------------------

    const totalPages =
        Math.ceil(
            totalPayments /
            safeLimit
        );


    return {

        payments,

        pagination: {

            currentPage,

            totalPages,

            totalPayments,

            limit: safeLimit,

            hasNextPage:
                currentPage <
                totalPages,

            hasPreviousPage:
                currentPage > 1

        },

        stats: {

            paidToday,

            pending,

            failedToday,

            refunded

        }

    };

};


const startOnlinePayment = async (
    userId,
    orderId
) => {

    const order = await Order.findOne({
        _id: orderId,
        userId
    });

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }


    if (order.status === "CANCELLED") {
        const error = new Error(
            "Payment cannot be started for a cancelled order"
        );
        error.statusCode = 400;
        throw error;
    }


    const payment = await Payment.findOne({
        orderId
    });

    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }


    if (payment.method === "COD") {
        const error = new Error(
            "COD payment does not require online payment"
        );
        error.statusCode = 400;
        throw error;
    }


    if (payment.status === "PAID") {
        const error = new Error(
            "Payment has already been completed"
        );
        error.statusCode = 400;
        throw error;
    }


    payment.status = "PROCESSING";

    await payment.save();


    return payment;
};


const markPaymentAsPaid = async ({
    orderId,
    transactionId,
    paymentGateway
}) => {

    const payment = await Payment.findOne({
        orderId
    });

    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }


    if (payment.status === "PAID") {
        return payment;
    }


    if (
        payment.status === "REFUNDED" ||
        payment.status === "PARTIALLY_REFUNDED"
    ) {
        const error = new Error(
            "Refunded payment cannot be marked as paid"
        );
        error.statusCode = 400;
        throw error;
    }


    payment.status = "PAID";
    payment.transactionId = transactionId;
    payment.paymentGateway = paymentGateway;
    payment.paidAt = new Date();
    payment.failureReason = null;


    await payment.save();


    await Order.findByIdAndUpdate(
        orderId,
        {
            $set: {
                status: "CONFIRMED"
            }
        }
    );


    return payment;
};


const markPaymentAsFailed = async (
    orderId,
    failureReason
) => {

    const payment = await Payment.findOne({
        orderId
    });

    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }


    if (
        payment.status === "PAID" ||
        payment.status === "REFUNDED" ||
        payment.status === "PARTIALLY_REFUNDED"
    ) {
        const error = new Error(
            "Completed or refunded payment cannot be marked as failed"
        );
        error.statusCode = 400;
        throw error;
    }


    payment.status = "FAILED";
    payment.failureReason = failureReason || null;


    await payment.save();


    return payment;
};


const markCodAsPaid = async ({
    orderId,
    transactionId
}) => {

    const payment = await Payment.findOne({
        orderId
    });

    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }


    if (payment.method !== "COD") {
        const error = new Error(
            "This payment is not COD"
        );
        error.statusCode = 400;
        throw error;
    }


    if (payment.status === "PAID") {
        return payment;
    }

    if (
        payment.status === "REFUNDED" ||
        payment.status === "PARTIALLY_REFUNDED"
    ) {
        const error = new Error(
            "Refunded payment cannot be marked as paid"
        );
        error.statusCode = 400;
        throw error;
    }


    payment.status = "PAID";
    payment.transactionId = transactionId || null;
    payment.paidAt = new Date();
    payment.failureReason = null;


    await payment.save();


    return payment;
};


const refundPayment = async ({
    orderId,
    amount
}) => {

    const payment = await Payment.findOne({
        orderId
    });

    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }


    if (
        payment.status !== "PAID" &&
        payment.status !== "PARTIALLY_REFUNDED"
    ) {
        const error = new Error(
            "Only paid payments can be refunded"
        );
        error.statusCode = 400;
        throw error;
    }


    const remainingAmount =
        payment.amount -
        payment.refundedAmount;


    if (
        amount <= 0 ||
        amount > remainingAmount
    ) {
        const error = new Error(
            "Invalid refund amount"
        );
        error.statusCode = 400;
        throw error;
    }


    payment.refundedAmount += amount;


    if (
        payment.refundedAmount ===
        payment.amount
    ) {

        payment.status = "REFUNDED";

    }
    else {

        payment.status =
            "PARTIALLY_REFUNDED";
    }


    await payment.save();


    return payment;
};


module.exports = {
    createPayment,
    getMyPayment,
    getPaymentForAdmin,
    getAllAdminPayments,
    startOnlinePayment,
    markPaymentAsPaid,
    markPaymentAsFailed,
    markCodAsPaid,
    refundPayment
};