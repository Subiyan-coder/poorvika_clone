const { body } = require("express-validator");


const createShipmentRules = [

    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("carrier")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage("Carrier name cannot exceed 100 characters"),

    body("trackingNumber")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Tracking number cannot exceed 100 characters"
        )
];


const updateShipmentRules = [

    body("status")
        .optional()
        .isIn([
            "PENDING",
            "PACKED",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "FAILED"
        ])
        .withMessage("Invalid shipment status"),

    body("carrier")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage("Carrier name cannot exceed 100 characters"),

    body("trackingNumber")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Tracking number cannot exceed 100 characters"
        )
];


module.exports = {
    createShipmentRules,
    updateShipmentRules
};