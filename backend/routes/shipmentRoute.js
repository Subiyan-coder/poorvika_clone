const express = require("express");

const {
    create,
    getOne,
    getAll,
    update
} = require("../controllers/shipmentController");

const {
    createShipmentRules,
    updateShipmentRules
} = require("../middleware/validationRules/shipmentRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// Admin

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getAll
);

router.get(
    "/:orderId",
    authenticate,
    authorize("ADMIN"),
    getOne
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createShipmentRules,
    validate,
    create
);

router.patch(
    "/:shipmentId",
    authenticate,
    authorize("ADMIN"),
    updateShipmentRules,
    validate,
    update
);


module.exports = router;