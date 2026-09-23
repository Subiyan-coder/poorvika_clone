const express = require("express");

const {
    getAll,
    getOne,
    update
} = require("../controllers/shipmentController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


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
    getOne
);


router.patch(
    "/admin/:shipmentId",
    authenticate,
    authorize("ADMIN"),
    update
);


module.exports = router;