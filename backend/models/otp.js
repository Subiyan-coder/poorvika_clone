const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        identifier : {
            type : String,
            required : true,
            trim : true
        },

        type : {
            type : String,
            enum : ["EMAIL", "PHONE"],
            required : true
        },

        purpose : {
            type : String,
            enum : [
                "REGISTER",
                "LOGIN",
                "RESET_PASSWORD",
                "CHANGE_EMAIL",
                "CHANGE_PHONE"
            ],
            required : true
        },

        otpHash : {
            type : String,
            required : true
        },

        expiresAt : {
            type : Date,
            required : true
        },

        attempts : {
            type : Number,
            default : 0
        }
    },

    {
        timestamps : true
    }
);

otpSchema.index(
    {expiresAt: 1 },
    {expireAfterSeconds: 0 }
);

const OTP = mongoose.model("OTP",otpSchema);

module.exports = OTP;