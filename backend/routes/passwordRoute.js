const express = require("express");

const {
    createPassword,
    changePassword,
    requestPasswordResetOtp,
    resetPassword
} = require("../controllers/passwordController");

const {
    createPasswordRules,
    changePasswordRules,
    passwordResetOtpRules,
    resetPasswordRules
} = require("../middleware/validationRules/passwordRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


router.post(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    createPasswordRules,
    validate,
    createPassword
);


router.patch(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    changePasswordRules,
    validate,
    changePassword
);


router.post(
    "/reset/request-otp",
    passwordResetOtpRules,
    validate,
    requestPasswordResetOtp
);


router.post(
    "/reset",
    resetPasswordRules,
    validate,
    resetPassword
);


module.exports = router;