const { body } = require("express-validator");


const createProductVariantRules = [

    body("productId")
        .notEmpty()
        .withMessage("Product is required")
        .isMongoId()
        .withMessage("Invalid product ID"),


    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("discountPercentage")
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

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("discountPercentage")
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