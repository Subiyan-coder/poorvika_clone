const {
    nameRule, 
    emailRule, 
    phoneRule, 
    passwordRule, 
    otpRule,
    identifierRule,
    typeRule
} = require("./globalRules");

const { body } = require("express-validator");

const registerRules = [
    nameRule,
    emailRule,
    phoneRule,
    passwordRule,

    body().custom((value) => {
        if (!value.email && !value.phone) {
            throw new Error("Either email or phone number is required");
        }

        return true;
    })
];

const loginRules = [
    typeRule,
    identifierRule,
    passwordRule,
    otpRule,

    body().custom((value) => {

        if (!value.password && !value.otp) {
            throw new Error(
                "Either Password or OTP is required"
            );
        }

        return true;
    })
];


const loginOtpRequestRules = [
    typeRule,
    identifierRule
];

module.exports = {
    registerRules,
    loginRules,
    loginOtpRequestRules
};