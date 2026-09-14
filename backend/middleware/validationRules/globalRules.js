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


const identifierRule = body("identifier")
    .trim()
    .notEmpty()
    .withMessage("Email or phone number is required")
    .custom((value, { req }) => {

        if (req.body.type === "EMAIL") {

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                throw new Error(
                    "Please provide a valid email address"
                );
            }

        }

        if (req.body.type === "PHONE") {

            if (!/^[6-9]\d{9}$/.test(value)) {
                throw new Error(
                    "Please provide a valid 10-digit phone number"
                );
            }

        }

        return true;
    });


const typeRule = body("type")
    .trim()
    .notEmpty()
    .withMessage("Verification type is required")
    .isIn(["EMAIL", "PHONE"])
    .withMessage("Invalid verification type");



module.exports = {
    nameRule, 
    emailRule, 
    phoneRule, 
    passwordRule, 
    otpRule, 
    identifierRule, 
    typeRule
};