const { body } = require("express-validator");

const changeEmailOtpRules = [
    body("newEmail")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
];

const changeEmailRules = [
    body("newEmail")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("otp")
        .matches(/^\d{6}$/)
        .withMessage("OTP must be exactly 6 digits")
];

const changePhoneOtpRules = [
    body("newPhone")
        .trim()
        .notEmpty()
        .withMessage("New phone number is required")
];

const changePhoneRules = [
    body("newPhone")
        .trim()
        .notEmpty()
        .withMessage("New phone number is required"),

    body("otp")
        .matches(/^\d{6}$/)
        .withMessage("OTP must be exactly 6 digits")
];

module.exports = {
    changeEmailOtpRules,
    changeEmailRules,
    changePhoneOtpRules,
    changePhoneRules
};