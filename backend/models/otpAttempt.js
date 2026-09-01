const mongoose = require("mongoose");

const otpAttemptSchema = new mongoose.Schema(
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

        attempts : {
            type : Number,
            default : 0,
            min : 0
        },

        isLocked : {
            type : Boolean,
            default : false
        },

        expiresAt : {
            type : Date,
            default : null
        }
    },
    {
        timestamps : true
    }
);

otpAttemptSchema.index(
    {
        identifier : 1,
        type : 1,
        purpose : 1
    },

    {
        unique : true
    }
);

otpAttemptSchema.index(
    { expiresAt : 1 },
    { expireAfterSeconds : 0 }
);

const OtpAttempt = mongoose.model("OtpAttempt", otpAttemptSchema);

module.exports = OtpAttempt;