const User = require("../models/user");
const { hashPassword, verifyPassword } = require("./passwordService");
const { createOtp, verifyOtp } = require("./otpService");
const { sendOtpNotification } = require("./notificationService");
const RefreshToken = require("../models/refreshToken");


const createPassword = async (userId, password) => {

    const user = await User.findById(userId).select("+password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.password) {
        const error = new Error(
            "Password already exists. Use change password instead"
        );
        error.statusCode = 409;
        throw error;
    }

    user.password = await hashPassword(password);

    await user.save();

    await RefreshToken.updateMany(
        {
            userId: user._id,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
    );

    return {
        message: "Password created successfully"
    };
};


const changePassword = async (userId, currentPassword, newPassword) => {

    const user = await User.findById(userId).select("+password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (!user.password) {
        const error = new Error(
            "Password is not set. Use create password instead"
        );
        error.statusCode = 400;
        throw error;
    }

    const isValid = await verifyPassword(
        currentPassword,
        user.password
    );

    if (!isValid) {
        const error = new Error("Current password is incorrect");
        error.statusCode = 401;
        throw error;
    }

    user.password = await hashPassword(newPassword);

    await user.save();

    await RefreshToken.updateMany(
        {
            userId: user._id,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
    );

    return {
        message: "Password changed successfully"
    };
};

const requestPasswordResetOtp = async ({ email, phone }) => {

    const identifier = email || phone;
    const type = email ? "EMAIL" : "PHONE";

    const user = await User.findOne(
        email
            ? { email }
            : { phone }
    );

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (!user.isActive) {
        const error = new Error("Your account is inactive");
        error.statusCode = 403;
        throw error;
    }

    const { otp, otpRecord } = await createOtp({
        identifier,
        type,
        purpose: "RESET_PASSWORD"
    });

    await sendOtpNotification({
        type,
        identifier,
        otp
    });

    return {
        message: "Password reset OTP sent successfully",
        data: {
            identifier,
            type,
            expiresAt: otpRecord.expiresAt
        }
    };
};

const resetPassword = async ({email, phone, otp, newPassword}) => {

    const identifier = email || phone;
    const type = email ? "EMAIL" : "PHONE";

    await verifyOtp({
        identifier,
        type,
        otp,
        purpose: "RESET_PASSWORD"
    });

    const user = await User.findOne(
        email
            ? { email }
            : { phone }
    );

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    user.password = await hashPassword(newPassword);

    await user.save();

    await RefreshToken.updateMany(
        {
            userId: user._id,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
    );

    return {
        message: "Password reset successfully"
    };
};

module.exports = {
    createPassword,
    changePassword,
    requestPasswordResetOtp,
    resetPassword
};