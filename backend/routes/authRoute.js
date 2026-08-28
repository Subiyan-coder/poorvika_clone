const express = require("express");
const {loginRule, registerRule} = require("../middleware/validationRules/authRules");
const {validate} = require("../middleware/validate");
const {register, verifyRegistrationOtp} = require("../controllers/authController");

const router = express.Router();

router.post('/register', registerRule, validate, register);

router.post('/verify-Registration-Otp', verifyRegistrationOtp);

module.exports = router;