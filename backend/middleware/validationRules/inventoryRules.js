const { body } = require("express-validator");


const adjustInventoryRules = [

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage(
            "Quantity must be a positive integer"
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
    adjustInventoryRules,
    availabilityRules
};