const express = require("express");

const {
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage
} = require("../controllers/profileController");

const { validate } = require("../middleware/validate");

const {
    updateProfileRules
} = require("../middleware/validationRules/profileRules");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    profileImageUpload
} = require("../middleware/upload");

const router = express.Router();


router.get(
    "/profile",
    authenticate,
    authorize("CUSTOMER"),
    getUserProfile
);


router.patch(
    "/profile",
    authenticate,
    authorize("CUSTOMER"),
    updateProfileRules,
    validate,
    updateUserProfile
);


router.patch(
    "/profile/picture",
    authenticate,
    authorize("CUSTOMER"),
    profileImageUpload.single("profileImage"),
    updateUserProfileImage
);


module.exports = router;