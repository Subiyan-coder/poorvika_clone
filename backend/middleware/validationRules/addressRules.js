const { body } = require("express-validator");

const createAddressRules = [

    body("type")
        .optional()
        .isIn(["HOME", "OFFICE", "OTHER"])
        .withMessage("Invalid address type"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),

    body("alternativePhone")
        .optional()
        .trim(),

    body("houseNo")
        .optional()
        .trim()
        .isLength({ max: 10 })
        .withMessage("House number cannot exceed 10 characters"),

    body("addressLine1")
        .trim()
        .notEmpty()
        .withMessage("Address line 1 is required")
        .isLength({ max: 200 })
        .withMessage("Address line 1 cannot exceed 200 characters"),

    body("addressLine2")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Address line 2 cannot exceed 200 characters"),

    body("postalCode")
        .trim()
        .notEmpty()
        .withMessage("Postal code is required"),

    body("area")
        .trim()
        .notEmpty()
        .withMessage("Area is required"),

    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),

    body("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),

    body("country")
        .trim()
        .notEmpty()
        .withMessage("Country is required"),

    body("isDefault")
        .optional()
        .isBoolean()
        .withMessage("isDefault must be a boolean")
];


const updateAddressRules = [

    body("type")
        .optional()
        .isIn(["HOME", "OFFICE", "OTHER"])
        .withMessage("Invalid address type"),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters"),

    body("phone")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Phone cannot be empty"),

    body("alternativePhone")
        .optional()
        .trim(),

    body("houseNo")
        .optional()
        .trim()
        .isLength({ max: 10 }),

    body("addressLine1")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Address line 1 cannot be empty")
        .isLength({ max: 200 }),

    body("addressLine2")
        .optional()
        .trim()
        .isLength({ max: 200 }),

    body("postalCode")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Postal code cannot be empty"),

    body("area")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Area cannot be empty"),

    body("city")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("City cannot be empty"),

    body("state")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("State cannot be empty"),

    body("country")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Country cannot be empty"),

    body("isDefault")
        .optional()
        .isBoolean()
        .withMessage("isDefault must be a boolean")
];


module.exports = {
    createAddressRules,
    updateAddressRules
};