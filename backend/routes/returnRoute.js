const express = require("express");

const {
    create,
    getMy,
    getOne,
    getAll,
    update
} = require("../controllers/returnController");

const {
    createReturnRules,
    updateReturnRules
} = require("../middleware/validationRules/returnRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// Customer

router.post(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    createReturnRules,
    validate,
    create
);

router.get(
    "/my",
    authenticate,
    authorize("CUSTOMER"),
    getMy
);

router.get(
    "/:returnId",
    authenticate,
    authorize("CUSTOMER"),
    getOne
);


// Admin

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getAll
);

router.patch(
    "/:returnId",
    authenticate,
    authorize("ADMIN"),
    updateReturnRules,
    validate,
    update
);


module.exports = router;