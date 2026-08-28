const {config} = require("../config/env");

const sendOtpSms = async ({mobile, otp}) => {

    const url = new URL("https://www.fast2sms.com/dev/bulkV2");

    url.searchParams.set("authorization", config.fast2sms.apiKey);
    url.searchParams.set("route", "otp"),
    url.searchParams.set("variables_values", otp);
    url.searchParams.set("numbers", mobile);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if(!response.ok || !data.return) {
            const error = new Error(data.message || "Failed to send OTP SMS");
            error.statusCode = 502;
            throw error;
        }

        return data;
    }
    catch (err){
        if(err.statusCode){
            throw err;
        }

        const smsError = new Error("SMS service is currently unavailable");
        smsError.statusCode = 502;
        throw smsError;
    }

};

module.exports = {sendOtpSms}