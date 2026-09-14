const express = require("express");

const {
    registerRules,
    loginRules,
    loginOtpRequestRules
} = require("../middleware/validationRules/authRules");

const { validate } = require("../middleware/validate");

const { authenticate } = require("../middleware/authMiddleware");

const {
    register,
    registrationOtp,
    verifyRegistrationOtp,
    login,
    loginOtp,
    logout,
    refresh,
    me
} = require("../controllers/authController");

const {
    registrationLimiter,
    registrationOtpLimiter,
    registrationVerifyOtpLimiter,
    loginOtpLimiter,
    loginLimiter
} = require("../middleware/rateLimiter");



const router = express.Router();



router.post(
    "/registration-otp",
    registrationOtpLimiter,
    registrationOtp
);


router.post(
    "/verify-account-otp",
    registrationVerifyOtpLimiter,
    verifyRegistrationOtp
);


router.post(
    "/register",
    registrationLimiter,
    registerRules,
    validate,
    register
);



router.post(
    "/login-request-otp",
    loginOtpLimiter,
    loginOtpRequestRules,
    loginOtp
);


router.post(
    "/login",
    loginLimiter,
    loginRules,
    validate,
    login
);

router.post(
    "/refresh",
    refresh
);

router.get(
    "/me",
    authenticate,
    me
);

router.post(
    "/logout",
    logout
);

module.exports = router;