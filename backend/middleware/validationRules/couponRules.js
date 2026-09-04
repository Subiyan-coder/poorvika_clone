const { body, param } = require("express-validator");


const createCouponRules = [

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Coupon code is required")
        .isLength({ max: 20 })
        .withMessage("Coupon code cannot exceed 20 characters")
        .matches(/^[A-Za-z0-9_-]+$/)
        .withMessage(
            "Coupon code can only contain letters, numbers, hyphens and underscores"
        ),


    body("discountType")
        .notEmpty()
        .withMessage("Discount type is required")
        .isIn(["PERCENTAGE", "FIXED"])
        .withMessage(
            "Discount type must be PERCENTAGE or FIXED"
        ),


    body("discountValue")
        .notEmpty()
        .withMessage("Discount value is required")
        .isFloat({ min: 0 })
        .withMessage(
            "Discount value must be a non-negative number"
        ),


    body("minimumOrderValue")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Minimum order value must be a non-negative number"
        ),


    body("maximumDiscountValue")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Maximum discount value must be a non-negative number"
        ),


    body("validFrom")
        .notEmpty()
        .withMessage("validFrom is required")
        .isISO8601()
        .withMessage("validFrom must be a valid date"),


    body("validUntil")
        .notEmpty()
        .withMessage("validUntil is required")
        .isISO8601()
        .withMessage("validUntil must be a valid date"),


    body("usageLimit")
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage(
            "Usage limit must be a non-negative integer"
        ),


    body("applicableProducts")
        .optional()
        .isArray()
        .withMessage(
            "applicableProducts must be an array"
        ),


    body("applicableProducts.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each applicable product must be a valid ID"
        ),


    body("applicableCategories")
        .optional()
        .isArray()
        .withMessage(
            "applicableCategories must be an array"
        ),


    body("applicableCategories.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each applicable category must be a valid ID"
        )
];


const updateCouponRules = [

    param("couponId")
        .isMongoId()
        .withMessage("Invalid coupon ID"),


    body("code")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Coupon code cannot be empty")
        .isLength({ max: 20 })
        .withMessage("Coupon code cannot exceed 20 characters")
        .matches(/^[A-Za-z0-9_-]+$/)
        .withMessage(
            "Coupon code can only contain letters, numbers, hyphens and underscores"
        ),


    body("discountType")
        .optional()
        .isIn(["PERCENTAGE", "FIXED"])
        .withMessage(
            "Discount type must be PERCENTAGE or FIXED"
        ),


    body("discountValue")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Discount value must be a non-negative number"
        ),


    body("minimumOrderValue")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Minimum order value must be a non-negative number"
        ),


    body("maximumDiscountValue")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Maximum discount value must be a non-negative number"
        ),


    body("validFrom")
        .optional()
        .isISO8601()
        .withMessage("validFrom must be a valid date"),


    body("validUntil")
        .optional()
        .isISO8601()
        .withMessage("validUntil must be a valid date"),


    body("usageLimit")
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage(
            "Usage limit must be a non-negative integer"
        ),


    body("applicableProducts")
        .optional()
        .isArray()
        .withMessage(
            "applicableProducts must be an array"
        ),


    body("applicableProducts.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each applicable product must be a valid ID"
        ),


    body("applicableCategories")
        .optional()
        .isArray()
        .withMessage(
            "applicableCategories must be an array"
        ),


    body("applicableCategories.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each applicable category must be a valid ID"
        )
];


const couponStatusRules = [

    param("couponId")
        .isMongoId()
        .withMessage("Invalid coupon ID"),


    body("isActive")
        .isBoolean()
        .withMessage(
            "isActive must be a boolean"
        )
];


const validateCouponRules = [

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Coupon code is required"),


    body("items")
        .isArray({ min: 1 })
        .withMessage(
            "At least one item is required"
        )
];


module.exports = {
    createCouponRules,
    updateCouponRules,
    couponStatusRules,
    validateCouponRules
};