const { body, param } = require("express-validator");


const createCartOrderRules = [

    body("addressId")
        .notEmpty()
        .withMessage("Address ID is required")
        .isMongoId()
        .withMessage("Invalid address ID")
];


const createDirectOrderRules = [

    body("productVariantId")
        .notEmpty()
        .withMessage("Product variant ID is required")
        .isMongoId()
        .withMessage("Invalid product variant ID"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    body("addressId")
        .notEmpty()
        .withMessage("Address ID is required")
        .isMongoId()
        .withMessage("Invalid address ID")
];


const orderIdRules = [

    param("orderId")
        .isMongoId()
        .withMessage("Invalid order ID")
];


const cancelOrderRules = [

    param("orderId")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("reason")
        .optional()
        .isString()
        .withMessage("Cancellation reason must be a string")
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Cancellation reason cannot exceed 500 characters"
        )
];


module.exports = {
    createCartOrderRules,
    createDirectOrderRules,
    orderIdRules,
    cancelOrderRules
};