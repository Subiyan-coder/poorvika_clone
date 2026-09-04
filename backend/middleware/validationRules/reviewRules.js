const { body, param } = require("express-validator");


const productVariantIdRule = body("productVariantId")
    .notEmpty()
    .withMessage("Product variant ID is required")
    .isMongoId()
    .withMessage("Invalid product variant ID");


const productVariantIdParamRule = param("productVariantId")
    .isMongoId()
    .withMessage("Invalid product variant ID");


const orderIdRule = body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid order ID");


const reviewIdRule = param("reviewId")
    .isMongoId()
    .withMessage("Invalid review ID");


const ratingRule = body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5");


const updateRatingRule = body("rating")
    .optional({ nullable: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5");


const commentRule = body("comment")
    .optional({ nullable: true })
    .isString()
    .withMessage("Comment must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters");


const removedImagePublicIdsRule =
    body("removedImagePublicIds")
        .optional({ nullable: true })
        .isArray()
        .withMessage(
            "Removed image public IDs must be an array"
        );


const createReviewRules = [
    productVariantIdRule,
    orderIdRule,
    ratingRule,
    commentRule
];


const updateReviewRules = [
    reviewIdRule,
    updateRatingRule,
    commentRule,
    removedImagePublicIdsRule
];


const deleteReviewRules = [
    reviewIdRule
];


const getProductReviewsRules = [
    productVariantIdParamRule
];


const disapproveReviewRules = [
    reviewIdRule
];


module.exports = {
    createReviewRules,
    updateReviewRules,
    deleteReviewRules,
    getProductReviewsRules,
    disapproveReviewRules
};