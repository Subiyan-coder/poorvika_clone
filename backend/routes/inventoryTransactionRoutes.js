const express = require("express");

const {
    getAll
} = require(
    "../controllers/inventoryTransactionController"
);

const {
    authenticate,
    authorize
} = require(
    "../middleware/authMiddleware"
);


const router = express.Router();


router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getAll
);


module.exports = router;