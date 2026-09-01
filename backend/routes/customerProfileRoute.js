const express = require("express");

const {
    getCustomerProfile,
    updateCustomerProfile,
    updateCustomerProfileImage
} = require("../controllers/customerProfileController");

const { validate } = require("../middleware/validate");

const { updateProfileRules } = require("../middleware/validationRules/customerProfileRules");

const { authenticate, authorize } = require("../middleware/authMiddleware");

const { upload } = require("../middleware/upload")

const router = express.Router();


router.get(
    "/profile",
    authenticate,
    authorize("CUSTOMER"),
    getCustomerProfile
);

router.patch(
    "/profile",
    authenticate,
    authorize("CUSTOMER"),
    updateProfileRules,
    validate,
    updateCustomerProfile
);

router.patch(
    "/profile/picture",
    authenticate,
    authorize("CUSTOMER"),
    upload.single("profileImage"),
    updateCustomerProfileImage
 );

module.exports = router;