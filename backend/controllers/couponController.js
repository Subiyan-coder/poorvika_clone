const {
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    updateCouponStatus,
    deleteCoupon,
    validateCoupon
} = require("../services/couponService");

const { logger } = require("../utils/logger");


const create = async (req, res, next) => {

    try {

        const coupon = await createCoupon(
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon
        });

    }
    catch (err) {

        logger.error(
            `Coupon creation failed: ${err.message}`
        );

        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const coupons = await getAllCoupons();

        return res.status(200).json({
            success: true,
            data: coupons
        });

    }
    catch (err) {
        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const coupon = await getCoupon(
            req.params.couponId
        );

        return res.status(200).json({
            success: true,
            data: coupon
        });

    }
    catch (err) {
        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const coupon = await updateCoupon(
            req.params.couponId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon
        });

    }
    catch (err) {

        logger.error(
            `Coupon update failed: ${err.message}`
        );

        next(err);
    }
};


const updateStatus = async (req, res, next) => {

    try {

        const coupon = await updateCouponStatus(
            req.params.couponId,
            req.body.isActive
        );

        return res.status(200).json({
            success: true,
            message: "Coupon status updated successfully",
            data: coupon
        });

    }
    catch (err) {

        logger.error(
            `Coupon status update failed: ${err.message}`
        );

        next(err);
    }
};


const remove = async (req, res, next) => {

    try {

        const result = await deleteCoupon(
            req.params.couponId
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    }
    catch (err) {

        logger.error(
            `Coupon deletion failed: ${err.message}`
        );

        next(err);
    }
};


const validate = async (req, res, next) => {

    try {

        const result = await validateCoupon({
            userId: req.user._id,
            code: req.body.code,
            items: req.body.items
        });

        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            data: result
        });

    }
    catch (err) {

        next(err);
    }
};


module.exports = {
    create,
    getAll,
    getOne,
    update,
    updateStatus,
    remove,
    validate
};