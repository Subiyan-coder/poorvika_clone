const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: null
        },

        phone: {
            type: String,
            trim: true,
            default: null
        },

        emailVerified: {
            type: Boolean,
            default: false
        },

        phoneVerified: {
            type: Boolean,
            default: false
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },

    {
        timestamps: true
    }
);


pendingRegistrationSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);


const PendingRegistration =
    mongoose.model(
        "PendingRegistration",
        pendingRegistrationSchema
    );


module.exports = PendingRegistration;