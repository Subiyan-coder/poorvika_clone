const { body, param } = require("express-validator");

const productVariantIdRule = body("productVariantId")
    .notEmpty()
    .withMessage("Product variant ID is required")
    .isMongoId()
    .withMessage("Invalid product variant ID");

const productVariantIdParamRule = param("productVariantId")
    .isMongoId()
    .withMessage("Invalid product variant ID");

const quantityRule = body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer");

const selectedRule = body("selected")
    .notEmpty()
    .withMessage("Selected value is required")
    .isBoolean()
    .withMessage("Selected must be a boolean");


const addItemRules = [
    productVariantIdRule,
    quantityRule
];

const updateItemRules = [
    productVariantIdParamRule,
    quantityRule
];

const selectionRules = [
    productVariantIdParamRule,
    selectedRule
];

const removeItemRules = [
    productVariantIdParamRule
];




module.exports = {
    addItemRules,
    updateItemRules,
    selectionRules,
    removeItemRules
};