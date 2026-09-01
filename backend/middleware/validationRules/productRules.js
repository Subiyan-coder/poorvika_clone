const { body } = require("express-validator");


const createProductRules = [

    body("categoryId")
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Invalid category ID"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ max: 500 })
        .withMessage("Product name cannot exceed 500 characters"),

    body("slug")
        .trim()
        .notEmpty()
        .withMessage("Product slug is required")
        .isLength({ max: 500 })
        .withMessage("Product slug cannot exceed 500 characters")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug must contain only lowercase letters, numbers and hyphens"
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Product description is required"),

    body("brand")
        .trim()
        .notEmpty()
        .withMessage("Brand is required")
        .isLength({ max: 100 })
        .withMessage("Brand cannot exceed 100 characters"),

    body("specification")
        .optional()
        .isObject()
        .withMessage("Specification must be an object")
];


const updateProductRules = [

    body("categoryId")
        .optional()
        .isMongoId()
        .withMessage("Invalid category ID"),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty")
        .isLength({ max: 500 })
        .withMessage("Product name cannot exceed 500 characters"),

    body("slug")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product slug cannot be empty")
        .isLength({ max: 500 })
        .withMessage("Product slug cannot exceed 500 characters")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug must contain only lowercase letters, numbers and hyphens"
        ),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product description cannot be empty"),

    body("brand")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Brand cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Brand cannot exceed 100 characters"),

    body("specification")
        .optional()
        .isObject()
        .withMessage("Specification must be an object")
];


const productStatusRules = [
    body("isActive")
        .isBoolean()
        .withMessage("isActive must be a boolean")
];


module.exports = {
    createProductRules,
    updateProductRules,
    productStatusRules
};