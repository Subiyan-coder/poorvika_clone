const {
    createPayment,
    getMyPayment,
    getPaymentForAdmin,
    getAllAdminPayments,
    startOnlinePayment,
    markPaymentAsPaid,
    markPaymentAsFailed,
    markCodAsPaid,
    refundPayment
} = require("../services/paymentService");


const create = async (req, res, next) => {

    try {

        const payment = await createPayment(
            req.user.userId,
            req.body.orderId,
            req.body.method
        );

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment
        });

    }
    catch (err) {
        next(err);
    }
};


const getMy = async (req, res, next) => {

    try {

        const payment = await getMyPayment(
            req.user.userId,
            req.params.orderId
        );

        return res.status(200).json({
            success: true,
            data: payment
        });

    }
    catch (err) {
        next(err);
    }
};


const getAdmin = async (req, res, next) => {

    try {

        const payment = await getPaymentForAdmin(
            req.params.orderId
        );

        return res.status(200).json({
            success: true,
            data: payment
        });

    }
    catch (err) {
        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const payments =
            await getAllAdminPayments({

                page:
                    req.query.page,

                limit:
                    req.query.limit,

                search:
                    req.query.search,

                status:
                    req.query.status,

                method:
                    req.query.method,

                sort:
                    req.query.sort

            });


        return res.status(200).json({

            success: true,

            data: payments

        });

    }
    catch (err) {

        next(err);

    }

};


const startOnline = async (req, res, next) => {

    try {

        const payment = await startOnlinePayment(
            req.user.userId,
            req.params.orderId
        );

        return res.status(200).json({
            success: true,
            message: "Online payment started",
            data: payment
        });

    }
    catch (err) {
        next(err);
    }
};


const markPaid = async (req, res, next) => {

    try {

        const payment = await markPaymentAsPaid({
            orderId: req.body.orderId,
            transactionId: req.body.transactionId,
            paymentGateway: req.body.paymentGateway
        });

        return res.status(200).json({
            success: true,
            message: "Payment marked as paid",
            data: payment
        });

    }
    catch (err) {
        next(err);
    }
};


const markFailed = async (req, res, next) => {

    try {

        const payment = await markPaymentAsFailed(
            req.body.orderId,
            req.body.failureReason
        );

        return res.status(200).json({
            success: true,
            message: "Payment marked as failed",
            data: payment
        });

    }
    catch (err) {
        next(err);
    }
};


const markCodPaid = async (req, res, next) => {

    try {

        const payment = await markCodAsPaid({
            orderId: req.body.orderId,
            transactionId: req.body.transactionId
        });

        return res.status(200).json({
            success: true,
            message: "COD payment marked as paid",
            data: payment
        });

    }
    catch (err) {
        next(err);
    }
};


const refund = async (req, res, next) => {

    try {

        const payment = await refundPayment({
            orderId: req.body.orderId,
            amount: req.body.amount
        });

        return res.status(200).json({
            success: true,
            message: "Payment refunded successfully",
            data: payment
        });

    }
    catch (err) {
        next(err);
    }
};


module.exports = {
    create,
    getMy,
    getAdmin,
    getAll,
    startOnline,
    markPaid,
    markFailed,
    markCodPaid,
    refund
};