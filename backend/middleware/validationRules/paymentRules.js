const { body, param } = require("express-validator");


const createPaymentRules = [

    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("method")
        .notEmpty()
        .withMessage("Payment method is required")
        .isIn([
            "COD",
            "UPI",
            "CARD",
            "NET_BANKING"
        ])
        .withMessage("Invalid payment method")
];


const orderIdRules = [

    param("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID")
];


const markPaidRules = [

    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("transactionId")
        .notEmpty()
        .withMessage("Transaction ID is required")
        .trim(),

    body("paymentGateway")
        .notEmpty()
        .withMessage("Payment gateway is required")
        .trim()
];


const markFailedRules = [

    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("failureReason")
        .optional({ nullable: true })
        .trim()
];


const markCodPaidRules = [

    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("transactionId")
        .optional({ nullable: true })
        .trim()
];


const refundRules = [

    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("amount")
        .isFloat({ gt: 0 })
        .withMessage(
            "Refund amount must be greater than 0"
        )
];


module.exports = {
    createPaymentRules,
    orderIdRules,
    markPaidRules,
    markFailedRules,
    markCodPaidRules,
    refundRules
};