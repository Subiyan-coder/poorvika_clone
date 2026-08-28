const {sendEMail} = require("../utils/mailer");
const {sendOtpSms} = require("../utils/fast2sms");

const sendOtpEmail = async ({to, otp}) => {

    const subject ="Poorvika - OTP Verification";
    const text = `your OTP is ${otp}. it is valid for 5 minutes. please do not share this otp with anyone`;
    
    const html = `
        <h2>Poorvika Notification</h2>
        <p>Your OTP is:</p>
        <h3>${otp}</h3>
        <p>This OTP is valid for 5 minutes.</p>
        <p>Please do not share this OTP with anyone.</p>
    `;

    return sendEMail(
        {
            to,
            subject,
            text,
            html
        }
    );
};

const sendOtpNotification = async({type, identifier, otp}) => {
    if (type === "EMAIL") {
        return sendOtpEmail(
            {
                to : identifier,
                otp
            }
        );
    };

    if (type === "PHONE") {
        return sendOtpSms(
            {
                mobile : identifier,
                otp
            }
        );
    };

    const error = new Error("unsupported OTP delivery type");
    error.statusCode = 400;
    throw error;
};

module.exports = {sendOtpEmail, sendOtpNotification};