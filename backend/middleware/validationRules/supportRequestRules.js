const { body, param } = require("express-validator");


const supportRequestIdRule = param("supportRequestId")
    .isMongoId()
    .withMessage("Invalid support request ID");


const subjectRule = body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isString()
    .withMessage("Subject must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Subject cannot exceed 200 characters");


const messageRule = body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters");


const categoryRule = body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
        "ORDER",
        "PRODUCT",
        "PAYMENT",
        "RETURN",
        "ACCOUNT",
        "OTHERS"
    ])
    .withMessage("Invalid support request category");


const orderIdRule = body("orderId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid order ID");


const statusRule = body("status")
    .optional()
    .isIn([
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED"
    ])
    .withMessage("Invalid support request status");


const adminResponseRule = body("adminResponse")
    .optional({ nullable: true })
    .isString()
    .withMessage("Admin response must be a string")
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
        "Admin response cannot exceed 1000 characters"
    );


const createSupportRequestRules = [
    subjectRule,
    messageRule,
    categoryRule,
    orderIdRule
];


const closeSupportRequestRules = [
    supportRequestIdRule
];


const updateSupportRequestRules = [
    supportRequestIdRule,
    statusRule,
    adminResponseRule
];


module.exports = {
    createSupportRequestRules,
    closeSupportRequestRules,
    updateSupportRequestRules
};