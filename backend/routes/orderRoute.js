const express = require("express");

const {
    createFromCart,
    createDirect,
    getMy,
    getOne,
    getAll,
    getOneForAdmin,
    cancel
} = require("../controllers/orderController");

const {
    createCartOrderRules,
    createDirectOrderRules,
    orderIdRules,
    cancelOrderRules
} = require("../middleware/validationRules/orderRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// Customer

router.get(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    getMy
);

router.post(
    "/cart",
    authenticate,
    authorize("CUSTOMER"),
    createCartOrderRules,
    validate,
    createFromCart
);

router.post(
    "/buy-now",
    authenticate,
    authorize("CUSTOMER"),
    createDirectOrderRules,
    validate,
    createDirect
);

router.patch(
    "/:orderId/cancel",
    authenticate,
    authorize("CUSTOMER"),
    cancelOrderRules,
    validate,
    cancel
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
    getOneForAdmin
);


// Customer single order

router.get(
    "/:orderId",
    authenticate,
    authorize("CUSTOMER"),
    orderIdRules,
    validate,
    getOne
);


module.exports = router;