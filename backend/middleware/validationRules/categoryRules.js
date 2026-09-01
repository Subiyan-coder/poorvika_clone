const { body } = require("express-validator");


const createCategoryRules = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ max: 100 })
        .withMessage("Category name cannot exceed 100 characters"),

    body("slug")
        .trim()
        .notEmpty()
        .withMessage("Category slug is required")
        .isLength({ max: 100 })
        .withMessage("Category slug cannot exceed 100 characters")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug must contain only lowercase letters, numbers and hyphens"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("images.url")
        .optional()
        .trim(),

    body("images.publicId")
        .optional()
        .trim()
];


const updateCategoryRules = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Category name cannot exceed 100 characters"),

    body("slug")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category slug cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Category slug cannot exceed 100 characters")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug must contain only lowercase letters, numbers and hyphens"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("images.url")
        .optional()
        .trim(),

    body("images.publicId")
        .optional()
        .trim()
];


const categoryStatusRules = [
    body("isActive")
        .isBoolean()
        .withMessage("isActive must be a boolean")
];


module.exports = {
    createCategoryRules,
    updateCategoryRules,
    categoryStatusRules
};