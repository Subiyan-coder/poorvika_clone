const {hashPassword} = require("./passwordService");
const {config} = require("../config/env");
const User = require("../models/user");
const PendingRegistration = require("../models/pendingRegistration");
const RefreshToken = require("../models/refreshToken");
const {createOtp, verifyOtp} = require("./otpService");
const {sendOtpNotification} = require("./notificationService");
const {generateAccessToken, generateRefreshToken, hashToken} = require("../utils/jwt");


const registerService = async({name, email, phone, password}) => {
const existingUser = await User.findOne(
        {
            $or : [
                ...(email ? [{email}] : []),
                ...(phone ? [{phone}]: [])
            ]
        }
    );

    if(existingUser) {
        const error = new Error("An account already exists with this Email or Phone number");
        error.statusCode = 409;
        throw error;
    }

    await PendingRegistration.deleteMany(
        {
            $or : [
                ...(email ? [{email}] : []),
                ...(phone ? [{phone}] : [])
            ]
        }
    );

    const passwordHash = password
            ? await hashPassword(password)
            : null;

    if (password) {
        const user = await User.create({
            name,
            email,
            phone,
            password: passwordHash,
            isVerified: true
        });

        return {
            message: "Account created successfully",
            data: {
                user
            }
        };
    }

    const identifier = email || phone;
    const type = email ? "EMAIL" : "PHONE";

    const {otp, otpRecord} = await createOtp(
        {
            identifier,
            type,
            purpose : "REGISTER"
        }
    );

    const expiresAt = new Date (
        Date.now() + 5 * 60 * 1000
    );

    await PendingRegistration.create(
        {
            name,
            email,
            phone,
            passwordHash,
            expiresAt
        }
    );

    await sendOtpNotification(
        {
            type,
            identifier,
            otp
        }
    )

    return {
        message : "OTP sent successfully",
        data : {
            identifier,
            type,
            purpose : otpRecord.purpose,
            expiresAt
        }
    };
};

const verifyAccountOtp = async ({email, phone, otp}) => {

    const existingUser = await User.findOne(
        {
            $or : [
                ...(email ? [{email}] : []),
                ...(phone ? [{phone}]: [])
            ]
        }
    );

    if(existingUser) {
        const error = new Error("An account already exists with this Email or Phone number");
        error.statusCode = 409;
        throw error;
    }

        const identifier = email || phone;
        const type = email ? "EMAIL" : "PHONE";

        const pendingRegistration = await PendingRegistration.findOne(
            email
            ? {email}
            : {phone}
        );

        if(!pendingRegistration){
            const error = new Error("Registration request not found");
            error.statusCode = 400;
            throw error
        }

        await verifyOtp(
            {
                identifier,
                type,
                otp,
                purpose : "REGISTER"
            }
        );

        const user = await User.create(
            {
                name : pendingRegistration.name,
                email : pendingRegistration.email,
                phone : pendingRegistration.phone,
                password : pendingRegistration.passwordHash,
                isVerified : true
            }
        );

        await pendingRegistration.deleteOne(
            {
                _id : pendingRegistration._id
            }
        );

        const payload = {
            userId : user._id,
            userRole : user.role
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const hashedRefreshToken = hashToken(refreshToken);

        await RefreshToken.create(
            {
                userId : user._id,
                tokenHash : hashedRefreshToken,
                expiresAt : new Date(
                    Date.now + config.jwt.refreshExpiresIn
                )
            }
        );

        return {
            user,
            accessToken,
            refreshToken
        };
}

module.exports = {registerService, verifyAccountOtp};