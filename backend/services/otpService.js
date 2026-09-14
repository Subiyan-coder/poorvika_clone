const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { config } = require("../config/env");
const OTP = require("../models/otp");


const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPT = 5;


const generateOtp = () => {

    return crypto
        .randomInt(100000, 1000000)
        .toString();

};


const hashOtp = async (otp) => {

    return bcrypt.hash(otp, config.bcrypt.saltRounds);

};


const createOtp = async ({
    identifier,
    type,
    purpose
}) => {

    const otp = generateOtp();

    const otpHash = await hashOtp(otp);

    const expiresAt = new Date(
        Date.now() +
        OTP_EXPIRY_MINUTES * 60 * 1000
    );


    const otpRecord = await OTP.findOneAndUpdate(

        {
            identifier,
            type,
            purpose
        },

        {
            otpHash,
            expiresAt,
            attempts: 0
        },

        {
            upsert: true,
            new: true
        }

    );



    return {
        otp,
        otpRecord,
        expiresAt
    };

};


const verifyOtp = async ({
    identifier,
    type,
    otp,
    purpose
}) => {

    const otpRecord = await OTP.findOne({

        identifier,
        type,
        purpose

    });


    if (!otpRecord) {

        const error = new Error(
            "OTP not found or expired"
        );

        error.statusCode = 400;

        throw error;

    }


    if (otpRecord.expiresAt <= new Date()) {

        await otpRecord.deleteOne();

        const error = new Error(
            "OTP has expired"
        );

        error.statusCode = 400;

        throw error;

    }


    if (otpRecord.attempts >= MAX_OTP_ATTEMPT) {

        await otpRecord.deleteOne();

        const error = new Error(
            "You've reached your maximum OTP attempts. Please request a new OTP."
        );

        error.statusCode = 429;

        throw error;

    }


    const isValid = await bcrypt.compare(
        otp,
        otpRecord.otpHash
    );


    if (!isValid) {

        otpRecord.attempts += 1;

        await otpRecord.save();


        if (otpRecord.attempts >= MAX_OTP_ATTEMPT) {

            await otpRecord.deleteOne();

            const error = new Error(
                "You've reached your maximum OTP attempts. Please request a new OTP."
            );

            error.statusCode = 429;

            throw error;

        }


        const error = new Error(
            "Invalid OTP"
        );

        error.statusCode = 400;

        throw error;

    }


    await otpRecord.deleteOne();


    return {
        verified: true
    };

};


module.exports = {
    createOtp,
    verifyOtp
};