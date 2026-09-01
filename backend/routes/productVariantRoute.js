const express = require("express");

const {
    create,
    getAll,
    getOne,
    getAllForAdmin,
    update,
    updateStatus,
    remove
} = require("../controllers/productVariantController");

const {
    createProductVariantRules,
    updateProductVariantRules,
    productVariantStatusRules
} = require("../middleware/validationRules/productVariantRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// Customer
router.get(
    "/product/:productId",
    getAll
);

router.get(
    "/:variantId",
    getOne
);


// Admin
router.get(
    "/admin/all",
    authenticate,
    authorize("ADMIN"),
    getAllForAdmin
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createProductVariantRules,
    validate,
    create
);

router.patch(
    "/:variantId",
    authenticate,
    authorize("ADMIN"),
    updateProductVariantRules,
    validate,
    update
);

router.patch(
    "/:variantId/status",
    authenticate,
    authorize("ADMIN"),
    productVariantStatusRules,
    validate,
    updateStatus
);

router.delete(
    "/:variantId",
    authenticate,
    authorize("ADMIN"),
    remove
);


module.exports = router;