const express = require("express");

const {
    requestEmailChange,
    verifyEmailChange,
    requestPhoneChange,
    verifyPhoneChange
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

const router = express.Router();

router.use(
    authenticate,
    authorize("CUSTOMER")
);

router.post(
    "/email/request-otp",
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