const express = require("express");

const {
    create,
    getMine,
    getOne,
    close,
    getAll,
    update
} = require("../controllers/supportRequestController");

const {
    createSupportRequestRules,
    closeSupportRequestRules,
    updateSupportRequestRules
} = require("../middleware/validationRules/supportRequestRules");

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
    getAll
);


router.patch(
    "/admin/:supportRequestId",
    authenticate,
    authorize("ADMIN"),
    updateSupportRequestRules,
    validate,
    update
);


/* CUSTOMER */


router.post(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    createSupportRequestRules,
    validate,
    create
);


router.get(
    "/my",
    authenticate,
    authorize("CUSTOMER"),
    getMine
);


router.get(
    "/:supportRequestId",
    authenticate,
    authorize("CUSTOMER"),
    closeSupportRequestRules,
    validate,
    getOne
);


router.patch(
    "/:supportRequestId/close",
    authenticate,
    authorize("CUSTOMER"),
    closeSupportRequestRules,
    validate,
    close
);



module.exports = router;