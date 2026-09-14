require("dotenv").config();
const ms = require("ms");

const config = {
    port : process.env.PORT,
    mongouri : process.env.MONGO_URI,

    jwt : {
        accessSecret : process.env.JWT_ACCESS_SECRET,
        accessExpiresIn : ms(process.env.JWT_ACCESS_EXPIRES_IN),

        refreshSecret : process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn : ms(process.env.JWT_REFRESH_EXPIRES_IN)
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
        saltRounds : Number(process.env.SALT_ROUNDS)
    },

    cloudinary : {
        cloudName : process.env.CLOUDINARY_CLOUD_NAME,
        apiKey : process.env.CLOUDINARY_API_KEY,
        apiSecret : process.env.CLOUDINARY_API_SECRET
    },

    admin : {
        adminName : process.env.ADMIN_NAME,
        adminEmail : process.env.ADMIN_EMAIL,
        adminPassword : process.env.ADMIN_PASSWORD
    }
};

module.exports = {config};