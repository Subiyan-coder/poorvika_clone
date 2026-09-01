const { 
    requestEmailChangeOtp,
    changeEmail,
    requestPhoneChangeOtp,
    changePhone
} = require("../services/accountService");

const { logger } = require("../utils/logger");


const requestEmailChange = async (req, res, next) => {

    try {

        const result = await requestEmailChangeOtp(
            req.user.userId,
            req.body.newEmail
        );

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });

    }
    catch (err) {

        logger.error(
            `Email change OTP request failed: ${err.message}`
        );

        next(err);
    }
};


const verifyEmailChange = async (req, res, next) => {

    try {

        const user = await changeEmail(
            req.user.userId,
            req.body.newEmail,
            req.body.otp
        );

        return res.status(200).json({
            success: true,
            message: "Email updated successfully",
            data: {
                email: user.email
            }
        });

    }
    catch (err) {

        logger.error(
            `Email change failed: ${err.message}`
        );

        next(err);
    }
};


const requestPhoneChange = async (req, res, next) => {

    try {

        const result = await requestPhoneChangeOtp(
            req.user.userId,
            req.body.newPhone
        );

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });

    }
    catch (err) {

        logger.error(
            `Phone change OTP request failed: ${err.message}`
        );

        next(err);
    }
};


const verifyPhoneChange = async (req, res, next) => {

    try {

        const user = await changePhone(
            req.user.userId,
            req.body.newPhone,
            req.body.otp
        );

        return res.status(200).json({
            success: true,
            message: "Phone number updated successfully",
            data: {
                phone: user.phone
            }
        });

    }
    catch (err) {

        logger.error(
            `Phone change failed: ${err.message}`
        );

        next(err);
    }
};


module.exports = {
    requestEmailChange,
    verifyEmailChange,
    requestPhoneChange,
    verifyPhoneChange
};