const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        orderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Order",
            required : true,
            unique : true
        },

        orderNumber: {
            type: String,
            trim: true,
            required: true
        },

        method : {
            type : String,
            enum : [
                "COD",
                "UPI",
                "CARD",
                "NET_BANKING"
            ],
            required : true
        },

        status : {
            type : String,
            enum : [
                "PENDING",
                "PROCESSING",
                "PAID",
                "FAILED",
                "REFUNDED",
                "PARTIALLY_REFUNDED"
            ],
            default : "PENDING"
        },

        amount : {
            type : Number,
            min : 0,
            required : true
        },

        refundedAmount: {
            type: Number,
            min: 0,
            default: 0
        },

        transactionId : {
            type : String,
            trim : true,
            default : null
        },

        paymentGateway : {
            type : String,
            trim : true,
            default : null
        },

        paidAt : {
            type : Date,
            default : null
        },

        expiresAt: {
            type: Date,
            default: null
        },

        failureReason: {
            type: String,
            trim: true,
            default: null,
            maxlength: 500
        }
    },

    {
        timestamps : true
    }
);

paymentSchema.index(
    {
        status : 1,
        createdAt : -1
    }
);

paymentSchema.index(
    {
        transactionId : 1
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;