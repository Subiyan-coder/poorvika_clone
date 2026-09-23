const {
    createOrderFromCart,
    createDirectOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    cancelOrder
} = require("../services/orderService");

const { logger } = require("../utils/logger");


const createFromCart = async (req, res, next) => {

    try {

        const order = await createOrderFromCart(
            req.user.userId,
            req.body.addressId
        );

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });

    }
    catch (err) {

        logger.error(
            `Cart order creation failed: ${err.message}`
        );

        next(err);
    }
};


const createDirect = async (req, res, next) => {

    try {

        const order = await createDirectOrder(
            req.user.userId,
            req.body.productVariantId,
            req.body.quantity,
            req.body.addressId
        );

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });

    }
    catch (err) {

        logger.error(
            `Direct order creation failed: ${err.message}`
        );

        next(err);
    }
};


const getMy = async (req, res, next) => {

    try {

        const orders = await getMyOrders(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            data: orders
        });

    }
    catch (err) {

        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const order = await getOrder(
            req.user.userId,
            req.params.orderId
        );

        return res.status(200).json({
            success: true,
            data: order
        });

    }
    catch (err) {

        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const result =
            await getAllOrders({

                page:
                    req.query.page,

                limit:
                    req.query.limit,

                search:
                    req.query.search,

                status:
                    req.query.status,

                sort:
                    req.query.sort

            });


        return res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (err) {

        next(err);

    }
};


const getOneForAdmin = async (req, res, next) => {

    try {

        const order = await getOrder(
            null,
            req.params.orderId,
            true
        );

        return res.status(200).json({
            success: true,
            data: order
        });

    }
    catch (err) {

        next(err);
    }
};


const cancel = async (req, res, next) => {

    try {

        const order = await cancelOrder(
            req.user.userId,
            req.params.orderId,
            req.body.reason
        );

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });

    }
    catch (err) {

        logger.error(
            `Order cancellation failed: ${err.message}`
        );

        next(err);
    }
};


module.exports = {
    createFromCart,
    createDirect,
    getMy,
    getOne,
    getAll,
    getOneForAdmin,
    cancel
};