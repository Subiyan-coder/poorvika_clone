const express = require("express");

const {
    requestEmailChange,
    verifyEmailChange,
    requestPhoneChange,
    verifyPhoneChange,
    getAdminsList
} = require("../controllers/accountController");

const {
    changeEmailOtpRules,
    changeEmailRules,
    changePhoneOtpRules,
    changePhoneRules
} = require("../middleware/validationRules/accountRules");

const { validate } = require("../middleware/validate");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    emailChangeOtpLimiter,
    phoneChangeOtpLimiter
} = require("../middleware/rateLimiter");



const router = express.Router();

router.get(
    "/admins",
    authenticate,
    authorize("ADMIN"),
    getAdminsList
);


router.use(
    authenticate,
    authorize("CUSTOMER")
);

router.post(
    "/email/request-otp",
    emailChangeOtpLimiter,
    changeEmailOtpRules,
    validate,
    requestEmailChange
);

router.patch(
    "/email",
    changeEmailRules,
    validate,
    verifyEmailChange
);

router.post(
    "/phone/request-otp",
    phoneChangeOtpLimiter,
    changePhoneOtpRules,
    validate,
    requestPhoneChange
);

router.patch(
    "/phone",
    changePhoneRules,
    validate,
    verifyPhoneChange
);

module.exports = router;