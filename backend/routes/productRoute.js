const express = require("express");

const {
    create,
    getAll,
    getOne,
    getAllForAdmin,
    update,
    updateStatus,
    remove
} = require("../controllers/productController");

const {
    createProductRules,
    updateProductRules,
    productStatusRules
} = require("../middleware/validationRules/productRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// Customer
router.get(
    "/",
    getAll
);

router.get(
    "/:productId",
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
    createProductRules,
    validate,
    create
);

router.patch(
    "/:productId",
    authenticate,
    authorize("ADMIN"),
    updateProductRules,
    validate,
    update
);

router.patch(
    "/:productId/status",
    authenticate,
    authorize("ADMIN"),
    productStatusRules,
    validate,
    updateStatus
);

router.delete(
    "/:productId",
    authenticate,
    authorize("ADMIN"),
    remove
);

module.exports = router;