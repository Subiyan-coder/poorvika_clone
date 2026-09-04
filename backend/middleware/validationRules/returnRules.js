const { body } = require("express-validator");


const createReturnRules = [

    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("items")
        .isArray({ min: 1 })
        .withMessage(
            "At least one item is required"
        ),

    body("items.*.productVariantId")
        .notEmpty()
        .withMessage(
            "Product variant ID is required"
        )
        .isMongoId()
        .withMessage(
            "Invalid product variant ID"
        ),

    body("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage(
            "Return quantity must be at least 1"
        ),

    body("items.*.reason")
        .notEmpty()
        .withMessage(
            "Return reason is required"
        )
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Return reason cannot exceed 500 characters"
        )
];


const updateReturnRules = [

    body("status")
        .optional()
        .isIn([
            "REQUESTED",
            "APPROVED",
            "REJECTED",
            "PICKUP_SCHEDULED",
            "RECEIVED",
            "REFUNDED",
            "CANCELLED"
        ])
        .withMessage(
            "Invalid return status"
        ),

    body("adminNotes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Admin notes cannot exceed 500 characters"
        )
];


module.exports = {
    createReturnRules,
    updateReturnRules
};