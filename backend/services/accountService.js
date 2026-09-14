const User = require("../models/user");
const { createOtp, verifyOtp } = require("./otpService");
const { sendOtpNotification } = require("./notificationService");

const requestChangeOtp = async (userId, newValue, type) => {

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const field = type === "EMAIL" ? "email" : "phone";
    const purpose = type === "EMAIL"
        ? "CHANGE_EMAIL"
        : "CHANGE_PHONE";

    if (user[field] === newValue) {
        const error = new Error(
            `New ${field} is the same as your current ${field}`
        );
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await User.findOne({
        [field]: newValue
    });

    if (existingUser) {
        const error = new Error(
            `An account already exists with this ${field}`
        );
        error.statusCode = 409;
        throw error;
    }

    const { otp, otpRecord } = await createOtp({
        identifier: newValue,
        type,
        purpose
    });

    await sendOtpNotification({
        type,
        identifier: newValue,
        otp
    });

    return {
        message: `${field} verification OTP sent successfully`,
        data: {
            identifier: newValue,
            expiresAt: otpRecord.expiresAt
        }
    };
};

const requestEmailChangeOtp = async (userId, newEmail) => {
    return requestChangeOtp(userId, newEmail, "EMAIL");
};

const requestPhoneChangeOtp = async (userId, newPhone) => {
    return requestChangeOtp(userId, newPhone, "PHONE");
};

const changeContact = async (userId, newValue, otp, type) => {

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const field = type === "EMAIL" ? "email" : "phone";
    const purpose = type === "EMAIL"
        ? "CHANGE_EMAIL"
        : "CHANGE_PHONE";

    await verifyOtp({
        identifier: newValue,
        type,
        otp,
        purpose
    });

    const existingUser = await User.findOne({
        [field]: newValue,
        _id: { $ne: userId }
    });

    if (existingUser) {
        const error = new Error(
            `An account already exists with this ${field}`
        );
        error.statusCode = 409;
        throw error;
    }

    user[field] = newValue;

    await user.save();

    return user;
};

const changeEmail = async (userId, newEmail, otp) => {
    return changeContact(userId, newEmail, otp, "EMAIL");
};

const changePhone = async (userId, newPhone, otp) => {
    return changeContact(userId, newPhone, otp, "PHONE");
};

const getAdmins = async () => {

    return User.find(
        {
            role: "ADMIN"
        },
        {
            name: 1,
            email: 1
        }
    )
    .sort({
        name: 1
    })
    .lean();

};

const getCurrentUser = async (userId) => {

    const user = await User.findById(userId)
        .select(
            "_id name email phone role profileImage isVerified isActive"
        )
        .lean();

    if (!user) {

        const error = new Error(
            "User not found"
        );

        error.statusCode = 404;

        throw error;

    }

    return user;
};


module.exports = {
    requestEmailChangeOtp,
    requestPhoneChangeOtp,
    changeEmail,
    changePhone,
    getAdmins,
    getCurrentUser
};