const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {createOtp, verifyOtp} = require("./otpService");
const {sendOtpNotification} = require("./notificationService");
const {generateAccessToken, generateRefreshToken} = require("../utils/jwt");

const requestLoginOtp = async ({email, phone}) => {

    const identifier = email || phone;
    const type = email ? "EMAIL" : "PHONE";

    const user = await User.findOne(
        email 
        ? {email} 
        : {phone}
    );

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

        const isPasswordValid = await bcrypt.compare(
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

    const refreshToken = generateRefreshToken(payload);

    return {
        message : "Login successfull",
        data : {
            user,
            accessToken,
            refreshToken
        }
    };
};

module.exports = {requestLoginOtp, loginService};