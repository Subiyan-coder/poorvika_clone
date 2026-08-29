const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const OTP = require("../models/otp");
const OtpAttempt = require("../models/otpAttempt");

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPT = 5;

const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const hashOtp = async(otp) => {
    return bcrypt.hash(otp, 10);
};

const createOtp = async ({identifier, type, purpose}) => {

    let attemptRecord = await OtpAttempt.findOne({
        identifier,
        type,
        purpose
    });

    if (attemptRecord?.isLocked) {
        const error = new Error(
            "You've reached your maximum OTP attempt. Please try again later."
        );

        error.statusCode = 429;
        throw error;
    }

    if (!attemptRecord) {
        attemptRecord = await OtpAttempt.create({
            identifier,
            type,
            purpose,
            expiresAt: new Date(
                Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
            )
        });
    }

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

const verifyOtp = async ({identifier, type, otp, purpose}) => {

    const attemptRecord = await OtpAttempt.findOne({
        identifier,
        type,
        purpose
    });

    if (!attemptRecord) {
        const error = new Error("OTP attempt record not found");
        error.statusCode = 400;
        throw error;
    }

    if (attemptRecord.isLocked) {
        const error = new Error(
            "You've reached your maximum OTP attempt. Please try again later."
        );

        error.statusCode = 429;
        throw error;
    }

    const otpRecords = await OTP.find(
        {
            identifier,
            type,
            purpose
        }
    ).sort({createdAt : -1});

    if(!otpRecords.length){
        const error = new Error("OTP not found or expired");
        error.statusCode = 400;
        throw error;
    }

    let otpRecord = null;

    for(const record of otpRecords) {

        if(record.expiresAt <= new Date()){
            continue;
        }

        if(record.attempts >= MAX_OTP_ATTEMPT) {
            continue;
        }

        const isValid = await bcrypt.compare(
            otp,
            record.otpHash
        );

        if(isValid){
            otpRecord = record;
            break;
        };

        record.attempts += 1;
        await record.save();

        

    }

    if (!otpRecord) {

        attemptRecord.attempts += 1;
        await attemptRecord.save();

        if (attemptRecord.attempts >= MAX_OTP_ATTEMPT) {

            attemptRecord.isLocked = true;

            attemptRecord.expiresAt = new Date(
                Date.now() + 15 * 60 * 1000
            );

            await attemptRecord.save();

            await OTP.deleteMany({
                identifier,
                type,
                purpose
            });

            const error = new Error(
                "You've reached your maximum OTP attempt. Please try again later."
            );

            error.statusCode = 429;
            throw error;
        }

        const error = new Error("Invalid OTP");
        error.statusCode = 400;
        throw error;
    }

    await OTP.deleteMany(
        {
            identifier : otpRecord.identifier,
            type : otpRecord.type,
            purpose : otpRecord.purpose
        }
    );

    await OtpAttempt.deleteOne({
        _id: attemptRecord._id
    });

    return otpRecord;
};

module.exports = {createOtp, verifyOtp}