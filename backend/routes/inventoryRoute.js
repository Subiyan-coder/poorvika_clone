const express = require("express");

const {
    create,
    getOne,
    getAll,
    adjust,
    updateAvailabilityStatus
} = require("../controllers/inventoryController");

const {
    createInventoryRules,
    adjustInventoryRules,
    availabilityRules
} = require("../middleware/validationRules/inventoryRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getAll
);


router.get(
    "/:productVariantId",
    authenticate,
    authorize("ADMIN"),
    getOne
);


router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createInventoryRules,
    validate,
    create
);


router.patch(
    "/:productVariantId/adjust",
    authenticate,
    authorize("ADMIN"),
    adjustInventoryRules,
    validate,
    adjust
);


router.patch(
    "/:productVariantId/availability",
    authenticate,
    authorize("ADMIN"),
    availabilityRules,
    validate,
    updateAvailabilityStatus
);


module.exports = router;