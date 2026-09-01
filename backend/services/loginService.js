const {verifyPassword} = require("./passwordService");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const {createOtp, verifyOtp} = require("./otpService");
const {sendOtpNotification} = require("./notificationService");
const {generateAccessToken} = require("../utils/jwt");
const {createRefreshToken} = require("./refreshTokenService");

const requestLoginOtp = async ({email, phone}) => {

    const identifier = email || phone;
    const type = email ? "EMAIL" : "PHONE";

    const user = await User.findOne(
        email 
        ? {email} 
        : {phone}
    ).select("+password");

    if(!user){
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if(!user.isActive){
        const error = new Error("Your account is inactive");
        error.statusCode = 403;
        throw error;
    }

    const {otp, otpRecord} = await createOtp(
       {
            identifier,
            type,
            purpose : "LOGIN"
        }
    );

    await sendOtpNotification(
        {
            type,
            identifier,
            otp
        }
    );

    return {
        message : "OTP sent successfully",
        data : {
            identifier,
            type,
            otpId : otpRecord._id.toString(),
            expiresAt : otpRecord.expiresAt
        }
    }
};

const loginService = async ({email, phone, password, otp}) => {

    const identifier = email || phone;
    const type = email ? "EMAIL" : "PHONE";

    const user = await User.findOne(
        email
        ? {email}
        : {phone}
    );

    if(!user) {
        const error = new Error("User not exist");
        error.statusCode = 401;
        throw error;
    }

    if(!user.isActive) {
        const error = new Error("Your account is inActive");
        error.statusCode = 403;
        throw error;
    }

    if(password){

        if(!user.password){
            const error = new Error("Password is not available for this account");
            error.statusCode = 400;
            throw error;
        }

        const isPasswordValid = await verifyPassword(
            password,
            user.password
        )

        if(!isPasswordValid) {
            const error = new Error("Invalid Email or Password");
            error.statusCode = 401;
            throw error;
        }
    }

    else if(otp){

        await verifyOtp(
            {
                identifier,
                type,
                otp,
                purpose : "LOGIN"
            }
        );
    }

    else {

        const error = new Error("Either Password or OTP is required");
        error.statusCode = 400;
        throw error;
    }

    const payload = {
        userId : user._id,
        userRole : user.role
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = await createRefreshToken(
        user._id,
        user.role
    );

    return {
        message : "Login successful",
        data : {
            user,
            accessToken,
            refreshToken
        }
    };
};

const logoutService = async (refreshToken) => {

    if (refreshToken) {

        const tokenHash = hashToken(refreshToken);

        await RefreshToken.findOneAndUpdate(
            {
                tokenHash,
                revokedAt: null
            },
            {
                revokedAt: new Date()
            }
        );
    }

    return {
        message: "Logout successful"
    };
};

module.exports = {requestLoginOtp, loginService, logoutService};