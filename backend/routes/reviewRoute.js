const express = require("express");

const {
    create,
    getProduct,
    getMine,
    update,
    remove,
    getAllForAdmin,
    disapprove
} = require("../controllers/reviewController");

const {
    createReviewRules,
    updateReviewRules,
    deleteReviewRules,
    getProductReviewsRules,
    disapproveReviewRules
} = require("../middleware/validationRules/reviewRules");

const {
    reviewImageUpload
} = require("../middleware/upload");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


/* ADMIN */

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    getAllForAdmin
);


router.patch(
    "/admin/:reviewId/disapprove",
    authenticate,
    authorize("ADMIN"),
    disapproveReviewRules,
    validate,
    disapprove
);


/* CUSTOMER */

router.post(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    reviewImageUpload.array("images", 5),
    createReviewRules,
    validate,
    create
);


router.get(
    "/product/:productVariantId",
    getProductReviewsRules,
    validate,
    getProduct
);


router.get(
    "/my",
    authenticate,
    authorize("CUSTOMER"),
    getMine
);


router.patch(
    "/:reviewId",
    authenticate,
    authorize("CUSTOMER"),
    reviewImageUpload.array("images", 5),
    updateReviewRules,
    validate,
    update
);


router.delete(
    "/:reviewId",
    authenticate,
    authorize("CUSTOMER"),
    deleteReviewRules,
    validate,
    remove
);


module.exports = router;