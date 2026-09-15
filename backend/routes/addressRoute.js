const express = require("express");

const {
    create,
    getAll,
    getOne,
    update,
    remove,
    setDefault
} = require("../controllers/addressController");

const {
    createAddressRules,
    updateAddressRules
} = require("../middleware/validationRules/addressRules");

const { validate } = require("../middleware/validate");

const {
    authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(
    authenticate
);

router.post(
    "/",
    createAddressRules,
    validate,
    create
);

router.get(
    "/",
    getAll
);

router.get(
    "/:addressId",
    getOne
);

router.patch(
    "/:addressId",
    updateAddressRules,
    validate,
    update
);

router.delete(
    "/:addressId",
    remove
);

router.patch(
    "/:addressId/default",
    setDefault
);

module.exports = router;