const {hashPassword} = require("./passwordService");
const {config} = require("../config/env");

const User = require("../models/user");
const PendingRegistration = require("../models/pendingRegistration");
const RefreshToken = require("../models/refreshToken");

const {createOtp, verifyOtp} = require("./otpService");
const {sendOtpNotification} = require("./notificationService");
const {generateAccessToken, generateRefreshToken, hashToken} = require("../utils/jwt");


const registerService = async ({
    name,
    email,
    phone,
    password,
    verifiedIdentifier,
    verifiedType
}) => {

    const existingEmail = await User.findOne({ email });

    const existingPhone = await User.findOne({ phone });

    if (existingEmail && existingPhone) {
        const error = new Error(
            "Email and phone number are already registered"
        );
        error.statusCode = 409;
        throw error;
    }

    if (existingEmail) {
        const error = new Error(
            "Email is already registered"
        );
        error.statusCode = 409;
        throw error;
    }

    if (existingPhone) {
        const error = new Error(
            "Phone number is already registered"
        );
        error.statusCode = 409;
        throw error;
    }

    const pendingRegistration =
        await PendingRegistration.findOne(
            verifiedType === "EMAIL"
                ? { email: verifiedIdentifier }
                : { phone: verifiedIdentifier }
        );

    if (!pendingRegistration) {

        const error = new Error(
            "Registration verification not found"
        );

        error.statusCode = 400;

        throw error;
    }


    if ( !pendingRegistration.emailVerified  &&
        !pendingRegistration.phoneVerified
    ) {
        const error = new Error(
            "Please verify your Email first"
        );

        error.statusCode = 400;
        throw error;
    }


    const passwordHash =
        await hashPassword(password);


    const user = await User.create({
        name,
        email,
        phone,
        password: passwordHash,
        isVerified: true
    });


    await pendingRegistration.deleteOne();


    const payload = {
        userId: user._id,
        userRole: user.role
    };


    const accessToken =
        generateAccessToken(payload);


    const refreshToken =
        generateRefreshToken(payload);


    const hashedRefreshToken =
        hashToken(refreshToken);


    await RefreshToken.create({
        userId: user._id,

        tokenHash: hashedRefreshToken,

        expiresAt: new Date(
            Date.now() +
            config.jwt.refreshExpiresIn
        )
    });


    return {
        user,
        accessToken,
        refreshToken
    };

};


const verifyAccountOtp = async ({
    identifier,
    type,
    otp
}) => {

    if (!["EMAIL", "PHONE"].includes(type)) {
        const error = new Error("Invalid verification type");
        error.statusCode = 400;
        throw error;
    }

    const pendingRegistration =
        await PendingRegistration.findOne(
            type === "EMAIL"
                ? { email: identifier }
                : { phone: identifier }
        );

    if (!pendingRegistration) {
        const error = new Error(
            "Registration request not found"
        );

        error.statusCode = 400;

        throw error;
    }

    await verifyOtp({
        identifier,
        type,
        otp,
        purpose: "REGISTER"
    });

    if (type === "EMAIL") {
        pendingRegistration.emailVerified = true;
    }

    if (type === "PHONE") {
        pendingRegistration.phoneVerified = true;
    }

    await pendingRegistration.save();

    return {
        verified: true,
        identifier,
        type
    };
};


const requestRegistrationOtp = async ({
    identifier,
    type
}) => {

    const existingUser = await User.findOne(
        type === "EMAIL"
            ? { email: identifier }
            : { phone: identifier }
    );


    if (existingUser) {

        const error = new Error(
            "An account already exists with this Email or Phone number"
        );

        error.statusCode = 409;

        throw error;
    }

    
    await PendingRegistration.deleteMany(
        type === "EMAIL"
            ? { email: identifier }
            : { phone: identifier }
    );

    
    const { otp, expiresAt } = await createOtp({

        identifier,
        type,
        purpose: "REGISTER"

    });


    await PendingRegistration.create({

        email: type === "EMAIL"
            ? identifier
            : null,

        phone: type === "PHONE"
            ? identifier
            : null,

        isVerified: false,

        expiresAt

    });


    await sendOtpNotification({

        type,
        identifier,
        otp

    });


    return {

        identifier,
        type,
        expiresAt

    };

};


module.exports = {registerService, verifyAccountOtp, requestRegistrationOtp};