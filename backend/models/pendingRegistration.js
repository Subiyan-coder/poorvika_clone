const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },

        email : {
            type : String,
            lowercase : true,
            trim : true
        },

        phone : {
            type : String,
            trim : true
        },
        
        passwordHash : {
            type : String
        },

        otpId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "OTP",
            required : true
        },

        expiresAt : {
            type : Date,
            required : true
        }
    },

    {
        timestamps : true
    }
);

pendingRegistrationSchema.index(
    {expiresAt : 1},
    {expireAfterSeconds : 0}
);

const PendingRegistration = mongoose.model("PendingRegistration", pendingRegistrationSchema);

module.exports = PendingRegistration;