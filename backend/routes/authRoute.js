const express = require("express");
const {registerRules, loginRules, loginOtpRequestRules} = require("../middleware/validationRules/authRules");
const {validate} = require("../middleware/validate");
const {register, registrationOtp, login, loginOtp} = require("../controllers/authController");


const router = express.Router();

router.post('/register', registerRules, validate, register);

router.post('/verify-account-otp', registrationOtp);

router.post('/login-request-otp', loginOtpRequestRules, validate, loginOtp);

router.post('/login', loginRules, validate, login);


module.exports = router;