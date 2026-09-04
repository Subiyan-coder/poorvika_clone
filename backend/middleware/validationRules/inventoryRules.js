const { body } = require("express-validator");


const createInventoryRules = [

    body("productVariantId")
        .notEmpty()
        .withMessage("Product variant is required")
        .isMongoId()
        .withMessage("Invalid product variant ID"),

    body("quantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Quantity must be a non-negative integer"
        ),

    body("lowStockThreshold")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Low stock threshold must be a non-negative integer"
        )
];


const adjustInventoryRules = [

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage(
            "Quantity must be a positive integer"
        ),

    body("type")
        .notEmpty()
        .withMessage("Adjustment type is required")
        .isIn(["ADJUSTMENT", "DAMAGE"])
        .withMessage(
            "Adjustment type must be ADJUSTMENT or DAMAGE"
        ),

    body("note")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Note cannot exceed 500 characters"
        )
];


const availabilityRules = [

    body("isAvailable")
        .notEmpty()
        .withMessage("Availability status is required")
        .isBoolean()
        .withMessage(
            "isAvailable must be a boolean"
        )
];


module.exports = {
    createInventoryRules,
    adjustInventoryRules,
    availabilityRules
};