const { body } = require("express-validator");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

const newPasswordRule = body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(passwordPattern)
    .withMessage(
        "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    );


const createPasswordRules = [
    newPasswordRule
];


const changePasswordRules = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    newPasswordRule,

    body("newPassword").custom((value, { req }) => {
        if (value === req.body.currentPassword) {
            throw new Error(
                "New password must be different from current password"
            );
        }

        return true;
    })
];


const resetPasswordRules = [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("phone")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Phone number cannot be empty"),

    body("otp")
        .notEmpty()
        .withMessage("OTP is required")
        .matches(/^\d{6}$/)
        .withMessage("OTP must be exactly 6 digits"),

    newPasswordRule,

    body().custom((value) => {
        if (!value.email && !value.phone) {
            throw new Error(
                "Either email or phone number is required"
            );
        }

        return true;
    })
];


const passwordResetOtpRules = [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("phone")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Phone number cannot be empty"),

    body().custom((value) => {
        if (!value.email && !value.phone) {
            throw new Error(
                "Either email or phone number is required"
            );
        }

        return true;
    })
];


module.exports = {
    createPasswordRules,
    changePasswordRules,
    resetPasswordRules,
    passwordResetOtpRules
};