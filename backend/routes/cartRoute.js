const express = require("express");

const {
    get,
    add,
    update,
    remove,
    select,
    clear
} = require("../controllers/cartController");

const {
    addItemRules,
    updateItemRules,
    selectionRules,
    removeItemRules
} = require("../middleware/validationRules/cartRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


router.get(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    get
);


router.post(
    "/items",
    authenticate,
    authorize("CUSTOMER"),
    addItemRules,
    validate,
    add
);


router.patch(
    "/items/:productVariantId",
    authenticate,
    authorize("CUSTOMER"),
    updateItemRules,
    validate,
    update
);


router.patch(
    "/items/:productVariantId/selection",
    authenticate,
    authorize("CUSTOMER"),
    selectionRules,
    validate,
    select
);


router.delete(
    "/items/:productVariantId",
    authenticate,
    authorize("CUSTOMER"),
    removeItemRules,
    validate,
    remove
);


router.delete(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    clear
);


module.exports = router;