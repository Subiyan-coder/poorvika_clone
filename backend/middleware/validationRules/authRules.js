const {nameRule, emailRule, phoneRule, passwordRule, otpRule} = require("./globalRules");

const { body } = require("express-validator");

const registerRule = [
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

const loginRule = [
    emailRule,
    phoneRule,
    passwordRule,
    otpRule,

    body().custom((value) => {
        if(!value.email && !value.phone) {
            throw new Error("Either email or phone number is required");
        }

        if(!value.password && !value.otp) {
            throw new Error("Either Password or OTP is required");
        }

        return true;
    })
];

module.exports = {
    registerRule,
    loginRule
};