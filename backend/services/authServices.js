const bcrypt = require("bcryptjs");
const User = require("../models/user");
const PendingRegistration = require("../models/pendingRegistration");
const OTP = require("../models/otp");
const {createOtp, verifyOtp} = require("./otpService");
const {sendOtpNotification} = require("./notificationService");
const {generateAccessToken, generateRefreshToken} = require("../utils/jwt");


const register = async({name, email, phone, password}) => {

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
        ? await bcrypt.hash(password, 10) 
        : null;

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
            otpId : otpRecord._id,
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
            expiresAt
        }
    };
};

const verifyRegistrationOtp = async ({otpId, otp}) => {
    try {
        const pendingRegistration = await PendingRegistration.findOne({otpId});

        if(!pendingRegistration){
            const error = new Error("Registration request not found or expired");
            error.statusCode = 400;
            throw error
        }

        const otpRecord = await verifyOtp({otpId, otp});

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

        await OTP.deleteOne(
            {
                _id : otpRecord._id
            }
        )

        const payload = {
            userId : user._id,
            userRole : user.role
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
            user,
            accessToken,
            refreshToken
        };
    }
    catch(err){
        throw err;
    }
}

module.exports = {register, verifyRegistrationOtp};