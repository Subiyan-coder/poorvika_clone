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
    "/",
    authenticate,
    getUserProfile
);


router.patch(
    "/",
    authenticate,
    updateProfileRules,
    validate,
    updateUserProfile
);


router.patch(
    "/picture",
    authenticate,
    profileImageUpload.single("profileImage"),
    updateUserProfileImage
);


module.exports = router;