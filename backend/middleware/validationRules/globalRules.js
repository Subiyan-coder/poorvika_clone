const { body } = require("express-validator");

const nameRule = body("name")
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name must not contain special characters or numbers');

const emailRule = body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail();

const phoneRule = body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty");

const passwordRule = body("password")
    .optional()
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

const otpRule = body ("otp")
        .optional()
        .matches(/^\d{6}$/)
        .withMessage('OTP must be exactly 6 digits');


module.exports = {nameRule, emailRule, phoneRule, passwordRule, otpRule};