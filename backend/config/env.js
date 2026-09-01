require("dotenv").config();

const config = {
    port : process.env.PORT,
    mongouri : process.env.MONGO_URI,

    jwt : {
        accessSecret : process.env.JWT_ACCESS_SECRET,
        accessExpiresIn : process.env.JWT_ACCESS_EXPIRES_IN,

        refreshSecret : process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn : process.env.JWT_REFRESH_EXPIRES_IN
    },

    mail : {
        host : process.env.MAIL_HOST,
        port : process.env.MAIL_PORT,
        user : process.env.MAIL_USER,
        password : process.env.MAIL_PASSWORD,
    },

    fast2sms : {
        apiKey : process.env.FAST2SMS_API_KEY
    },

    bcrypt : {
        saltRounds : process.env.SALT_ROUNDS
    },

    cloudinary : {
        cloudName : process.env.CLOUDINAY_CLOUD_NAME,
        apiKey : process.env.CLOUDINAY_AP1_KEY,
        apiSecret : process.env.CLOUDINAY_AP1_SECRET
    }
};

module.exports = {config};