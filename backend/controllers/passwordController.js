const {
    createPassword: createPasswordService,
    changePassword: changePasswordService,
    requestPasswordResetOtp: requestPasswordResetOtpService,
    resetPassword: resetPasswordService
} = require("../services/passwordAccountService");

const { logger } = require("../utils/logger");
const { clearAuthCookies } = require("../utils/cookie");


const createPassword = async (req, res, next) => {

    try {

        const result = await createPasswordService(
            req.user.userId,
            req.body.newPassword
        );

        return res.status(201).json({
            success: true,
            message: result.message
        });

    }
    catch (err) {

        logger.error(`Password creation failed: ${err.message}`);

        next(err);
    }
};


const changePassword = async (req, res, next) => {

    try {

        const result = await changePasswordService(
            req.user.userId,
            req.body.currentPassword,
            req.body.newPassword
        );

        clearAuthCookies(res);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    }
    catch (err) {

        logger.error(`Password change failed: ${err.message}`);

        next(err);
    }
};


const requestPasswordResetOtp = async (req, res, next) => {

    try {

        const result = await requestPasswordResetOtpService(
            req.body
        );

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });

    }
    catch (err) {

        logger.error(
            `Password reset OTP request failed: ${err.message}`
        );

        next(err);
    }
};


const resetPassword = async (req, res, next) => {

    try {

        const result = await resetPasswordService(
            req.body
        );

        clearAuthCookies(res);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    }
    catch (err) {

        logger.error(`Password reset failed: ${err.message}`);

        next(err);
    }
};


module.exports = {
    createPassword,
    changePassword,
    requestPasswordResetOtp,
    resetPassword
};