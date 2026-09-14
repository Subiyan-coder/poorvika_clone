const { body, query  } = require("express-validator");


const createCategoryRules = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ max: 100 })
        .withMessage("Category name cannot exceed 100 characters"),

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

const categoryAdminQueryRules = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),

    query("search")
        .optional()
        .trim(),

    query("status")
        .optional()
        .isIn([
            "ALL",
            "ACTIVE",
            "INACTIVE"
        ])
        .withMessage(
            "Status must be ALL, ACTIVE, or INACTIVE"
        ),

    query("sort")
        .optional()
        .isIn([
            "NEWEST",
            "OLDEST",
            "NAME_ASC",
            "NAME_DESC"
        ])
        .withMessage(
            "Invalid category sort option"
        )
];


module.exports = {
    createCategoryRules,
    updateCategoryRules,
    categoryStatusRules,
    categoryAdminQueryRules
};