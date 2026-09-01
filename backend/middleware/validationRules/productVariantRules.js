const { body } = require("express-validator");


const createProductVariantRules = [

    body("productId")
        .notEmpty()
        .withMessage("Product is required")
        .isMongoId()
        .withMessage("Invalid product ID"),

    body("sku")
        .trim()
        .notEmpty()
        .withMessage("SKU is required")
        .isLength({ max: 100 })
        .withMessage("SKU cannot exceed 100 characters"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("discountPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Discount price must be a positive number"
        ),

    body("attributes")
        .optional()
        .isObject()
        .withMessage("Attributes must be an object")
];


const updateProductVariantRules = [

    body("sku")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("SKU cannot be empty")
        .isLength({ max: 100 })
        .withMessage("SKU cannot exceed 100 characters"),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("discountPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Discount price must be a positive number"
        ),

    body("attributes")
        .optional()
        .isObject()
        .withMessage("Attributes must be an object")
];


const productVariantStatusRules = [

    body("isActive")
        .isBoolean()
        .withMessage("isActive must be a boolean")
];


module.exports = {
    createProductVariantRules,
    updateProductVariantRules,
    productVariantStatusRules
};