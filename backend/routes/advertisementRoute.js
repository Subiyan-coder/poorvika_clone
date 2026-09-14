const express = require("express");

const {
    create,
    update,
    remove,
    getAll,
    getActive
} = require("../controllers/advertisementController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    upload
} = require("../middleware/upload");


const router = express.Router();


// =========================
// Public
// =========================

router.get(
    "/active",
    getActive
);


// =========================
// Admin
// =========================

router.use(
    authenticate,
    authorize("ADMIN")
);


router.get(
    "/",
    getAll
);


router.post(
    "/",
    upload.single("image"),
    create
);


router.patch(
    "/:id",
    upload.single("image"),
    update
);


router.delete(
    "/:id",
    remove
);


module.exports = router;