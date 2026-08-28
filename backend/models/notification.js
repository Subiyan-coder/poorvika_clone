const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "ORDER",
                "PAYMENT",
                "SHIPMENT",
                "RETURN",
                "PROMOTION",
                "SYSTEM"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        },

        readAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    userId: 1,
    isRead: 1,
    createdAt: -1
});

notificationSchema.index({
    userId: 1,
    createdAt: -1
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;