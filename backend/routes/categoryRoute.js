const express = require("express");

const {
    create,
    getAll,
    getOne,
    getAllForAdmin,
    update,
    updateStatus,
    remove
} = require("../controllers/categoryController");

const {
    createCategoryRules,
    updateCategoryRules,
    categoryStatusRules
} = require("../middleware/validationRules/categoryRules");

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
    "/:categoryId",
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
    createCategoryRules,
    validate,
    create
);

router.patch(
    "/:categoryId",
    authenticate,
    authorize("ADMIN"),
    updateCategoryRules,
    validate,
    update
);

router.patch(
    "/:categoryId/status",
    authenticate,
    authorize("ADMIN"),
    categoryStatusRules,
    validate,
    updateStatus
);

router.delete(
    "/:categoryId",
    authenticate,
    authorize("ADMIN"),
    remove
);

module.exports = router;