const Coupon = require("../models/coupon");
const CouponUsage = require("../models/couponUsage");


const createCoupon = async ({
    code,
    discountType,
    discountValue,
    minimumOrderValue,
    maximumDiscountValue,
    validFrom,
    validUntil,
    usageLimit,
    applicableProducts,
    applicableCategories
}) => {

    if (validFrom >= validUntil) {
        const error = new Error(
            "validFrom must be before validUntil"
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        discountType === "PERCENTAGE" &&
        discountValue > 100
    ) {
        const error = new Error(
            "Percentage discount cannot exceed 100"
        );
        error.statusCode = 400;
        throw error;
    }

    const existingCoupon = await Coupon.findOne({
        code: code.toUpperCase()
    });

    if (existingCoupon) {
        const error = new Error(
            "A coupon with this code already exists"
        );
        error.statusCode = 409;
        throw error;
    }

    const coupon = await Coupon.create({
        code,
        discountType,
        discountValue,
        minimumOrderValue,
        maximumDiscountValue,
        validFrom,
        validUntil,
        usageLimit,
        applicableProducts,
        applicableCategories,
        isActive: false
    });

    return coupon;
};


const getAllCoupons = async () => {

    return Coupon.find()
        .sort({
            createdAt: -1
        });
};


const getCoupon = async (couponId) => {

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        const error = new Error("Coupon not found");
        error.statusCode = 404;
        throw error;
    }

    return coupon;
};


const updateCoupon = async (
    couponId,
    data
) => {

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        const error = new Error("Coupon not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        data.validFrom !== undefined &&
        data.validUntil !== undefined &&
        data.validFrom >= data.validUntil
    ) {
        const error = new Error(
            "validFrom must be before validUntil"
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        data.discountType === "PERCENTAGE" &&
        data.discountValue !== undefined &&
        data.discountValue > 100
    ) {
        const error = new Error(
            "Percentage discount cannot exceed 100"
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        data.code !== undefined &&
        data.code.toUpperCase() !== coupon.code
    ) {

        const existingCoupon = await Coupon.findOne({
            code: data.code.toUpperCase(),
            _id: {
                $ne: couponId
            }
        });

        if (existingCoupon) {
            const error = new Error(
                "A coupon with this code already exists"
            );
            error.statusCode = 409;
            throw error;
        }

        coupon.code = data.code;
    }

    const allowedFields = [
        "discountType",
        "discountValue",
        "minimumOrderValue",
        "maximumDiscountValue",
        "validFrom",
        "validUntil",
        "usageLimit",
        "applicableProducts",
        "applicableCategories"
    ];

    for (const field of allowedFields) {

        if (data[field] !== undefined) {
            coupon[field] = data[field];
        }

    }

    await coupon.save();

    return coupon;
};


const updateCouponStatus = async (
    couponId,
    isActive
) => {

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        const error = new Error("Coupon not found");
        error.statusCode = 404;
        throw error;
    }

    coupon.isActive = isActive;

    await coupon.save();

    return coupon;
};


const deleteCoupon = async (
    couponId
) => {

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        const error = new Error("Coupon not found");
        error.statusCode = 404;
        throw error;
    }

    const usageExists = await CouponUsage.exists({
        couponId
    });

    if (usageExists) {
        const error = new Error(
            "Coupon cannot be deleted because it has usage history"
        );
        error.statusCode = 409;
        throw error;
    }

    await coupon.deleteOne();

    return {
        message: "Coupon deleted successfully"
    };
};


const validateCoupon = async ({
    userId,
    code,
    items
}) => {

    const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true
    });

    if (!coupon) {
        const error = new Error(
            "Invalid or inactive coupon"
        );
        error.statusCode = 400;
        throw error;
    }


    const now = new Date();

    if (
        now < coupon.validFrom ||
        now > coupon.validUntil
    ) {
        const error = new Error(
            "Coupon is expired or not yet valid"
        );
        error.statusCode = 400;
        throw error;
    }


    if (
        coupon.usageLimit !== null &&
        coupon.usedCount >= coupon.usageLimit
    ) {
        const error = new Error(
            "Coupon usage limit has been reached"
        );
        error.statusCode = 400;
        throw error;
    }


    const alreadyUsed = await CouponUsage.exists({
        couponId: coupon._id,
        userId
    });

    if (alreadyUsed) {
        const error = new Error(
            "You have already used this coupon"
        );
        error.statusCode = 400;
        throw error;
    }

    const hasProductRestrictions =
        coupon.applicableProducts.length > 0;

    const hasCategoryRestrictions =
        coupon.applicableCategories.length > 0;


    let eligibleItems = items;


    if (
        hasProductRestrictions ||
        hasCategoryRestrictions
    ) {

        eligibleItems = items.filter(item => {

            const productMatches =
                hasProductRestrictions &&
                coupon.applicableProducts.some(
                    productId =>
                        productId.toString() ===
                        item.productId.toString()
                );


            const categoryMatches =
                hasCategoryRestrictions &&
                coupon.applicableCategories.some(
                    categoryId =>
                        categoryId.toString() ===
                        item.categoryId.toString()
                );


            return productMatches || categoryMatches;
        });

    }


    if (eligibleItems.length === 0) {

        const error = new Error(
            "Coupon is not applicable to these products"
        );

        error.statusCode = 400;

        throw error;
    }

    const eligibleSubtotal = eligibleItems.reduce(
        (total, item) =>
            total + (
                item.unitPrice * item.quantity
            ),
        0
    );


    if (
        eligibleSubtotal <
        coupon.minimumOrderValue
    ) {

        const error = new Error(
            `Minimum eligible order value is ${coupon.minimumOrderValue}`
        );

        error.statusCode = 400;

        throw error;
    }


    let discountAmount = 0;


    if (
        coupon.discountType === "PERCENTAGE"
    ) {

        discountAmount =
            eligibleSubtotal *
            (coupon.discountValue / 100);


        if (
            coupon.maximumDiscountValue !== null &&
            coupon.maximumDiscountValue > 0
        ) {

            discountAmount = Math.min(
                discountAmount,
                coupon.maximumDiscountValue
            );

        }

    }


    if (
        coupon.discountType === "FIXED"
    ) {

        discountAmount =
            coupon.discountValue;

    }


    discountAmount = Math.min(
        discountAmount,
        eligibleSubtotal
    );


    return {
        couponId: coupon._id,
        code: coupon.code,
        usageLimit: coupon.usageLimit,
        eligibleSubtotal,
        discountAmount
    };
};

module.exports = {
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    updateCouponStatus,
    deleteCoupon,
    validateCoupon
};