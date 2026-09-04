const express = require("express");

const {
    create,
    getAll,
    getOne,
    update,
    updateStatus,
    remove,
    validate : validateCoupon
} = require("../controllers/couponController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    createCouponRules,
    updateCouponRules,
    couponStatusRules,
    validateCouponRules
} = require("../middleware/validationRules/couponRules");

const { validate } = require("../middleware/validate");


const router = express.Router();


// Customer

router.post(
    "/validate",
    authenticate,
    authorize("CUSTOMER"),
    validateCouponRules,
    validate,
    validateCoupon
);

// Admin

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getAll
);

router.get(
    "/:couponId",
    authenticate,
    authorize("ADMIN"),
    getOne
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createCouponRules,
    validate,
    create
);

router.patch(
    "/:couponId",
    authenticate,
    authorize("ADMIN"),
    updateCouponRules,
    validate,
    update
);

router.patch(
    "/:couponId/status",
    authenticate,
    authorize("ADMIN"),
    couponStatusRules,
    validate,
    updateStatus
);

router.delete(
    "/:couponId",
    authenticate,
    authorize("ADMIN"),
    remove
);


module.exports = router;