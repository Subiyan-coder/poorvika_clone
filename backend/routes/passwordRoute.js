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

const {
    createPasswordLimiter,
    changePasswordLimiter,
    passwordResetOtpLimiter,
    resetPasswordLimiter
} = require("../middleware/rateLimiter");



const router = express.Router();


router.post(
    "/",
    authenticate,
    createPasswordLimiter,
    createPasswordRules,
    validate,
    createPassword
);


router.patch(
    "/",
    authenticate,
    changePasswordLimiter,
    changePasswordRules,
    validate,
    changePassword
);


router.post(
    "/reset/request-otp",
    passwordResetOtpLimiter,
    passwordResetOtpRules,
    validate,
    requestPasswordResetOtp
);


router.post(
    "/reset",
    resetPasswordLimiter,
    resetPasswordRules,
    validate,
    resetPassword
);


module.exports = router;