const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const OTP = require("../models/otp");

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPT = 5;

const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const hashOtp = async(otp) => {
    return bcrypt.hash(otp, 10);
};

const createOtp = async ({identifier, type, purpose}) => {

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    
    const expiresAt = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    const otpRecord = await OTP.create(
        {
            identifier,
            type,
            purpose,
            otpHash,
            expiresAt
        }
    );

    return {
        otp, 
        otpRecord
    };
};

const verifyOtp = async ({otpId, otp}) => {

    const otpRecord = await OTP.findById(otpId);

    if(!otpRecord){
        const error = new Error("OTP not found or expired");
        error.statusCode = 400;
        throw error;
    }

    if(otpRecord.expiresAt <= new Date()) {
        const error = new Error("OTP is expired");
        error.statusCode = 400;
        throw error;
    }

    if(otpRecord.attempts >= MAX_OTP_ATTEMPT) {
        const error = new Error("Maximum OTP attemp is reached");
        error.statusCode = 429;
        throw error;
    }

    const isValid = await bcrypt.compare(
        otp,
        otpRecord.otpHash
    );

    if(!isValid) {
        otpRecord.attempts += 1;
        await otpRecord.save();

        const error = new Error("Invalid OTP");
        error.statusCode = 400;
        throw error;
    }

    return true;
};

module.exports = {createOtp, verifyOtp}