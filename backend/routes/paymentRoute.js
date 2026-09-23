const express = require("express");

const {
    create,
    getMy,
    getAdmin,
    getAll,
    startOnline,
    markPaid,
    markFailed,
    markCodPaid,
    refund
} = require("../controllers/paymentController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    validate
} = require("../middleware/validate");

const {
    createPaymentRules,
    orderIdRules,
    markPaidRules,
    markFailedRules,
    markCodPaidRules,
    refundRules
} = require("../middleware/validationRules/paymentRules");

const router = express.Router();


// Customer

router.post(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    createPaymentRules,
    validate,
    create
);

router.get(
    "/:orderId",
    authenticate,
    authorize("CUSTOMER"),
    orderIdRules,
    validate,
    getMy
);

router.post(
    "/:orderId/start",
    authenticate,
    authorize("CUSTOMER"),
    orderIdRules,
    validate,
    startOnline
);


// Admin

router.get(
    "/admin/all",
    authenticate,
    authorize("ADMIN"),
    getAll
);

router.get(
    "/admin/:orderId",
    authenticate,
    authorize("ADMIN"),
    orderIdRules,
    validate,
    getAdmin
);

router.post(
    "/admin/mark-paid",
    authenticate,
    authorize("ADMIN"),
    markPaidRules,
    validate,
    markPaid
);

router.post(
    "/admin/mark-failed",
    authenticate,
    authorize("ADMIN"),
    markFailedRules,
    validate,
    markFailed
);

router.post(
    "/admin/cod-paid",
    authenticate,
    authorize("ADMIN"),
    markCodPaidRules,
    validate,
    markCodPaid
);

router.post(
    "/admin/refund",
    authenticate,
    authorize("ADMIN"),
    refundRules,
    validate,
    refund
);


module.exports = router;