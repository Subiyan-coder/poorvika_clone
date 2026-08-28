const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        orderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Order",
            required : true
        },

        items : [
            {
                productVariantId : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "ProductVariant",
                    required : true
                },

                quantity : {
                    type : Number,
                    required : true,
                    min : 1
                },

                reason : {
                    type : String,
                    required : true,
                    trim : true,
                    maxlength : 500
                }
            }
        ],

        status : {
            type : String,
            enum : [
                "REQUESTED",
                "APPROVED",
                "REJECTED",
                "PICKUP_SCHEDULED",
                "RECEIVED",
                "REFUNDED",
                "CANCELLED"
            ],
            default : "REQUESTED"
        },

        adminNotes : {
            type : String,
            trim : true,
            maxlength : 500,
            default : null
        },

        requestedAt : {
            type : Date,
            default : Date.now
        },

        approvedAt : {
            type : Date,
            default : null
        },

        receivedAt : {
            type : Date,
            default : null
        },

        refundedAt : {
            type : Date,
            default : null
        }
    },

    {
        timestamps : true
    }
);

returnSchema.index({
    orderId: 1,
    createdAt: -1
});

returnSchema.index({
    userId: 1,
    createdAt: -1
});

returnSchema.index({
    status: 1,
    createdAt: -1
});

const Return = mongoose.model("Return", returnSchema);

module.exports = Return;