const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        subject : {
            type : String,
            required : true,
            trim : true,
            maxlength : 200
        },

        message : {
            type : String,
            required : true,
            trim : true,
            maxlength : 1000
        },

        category : {
            type : String,
            enum : [
                "ORDER",
                "PRODUCT",
                "PAYMENT",
                "RETURN",
                "ACCOUNT",
                "OTHERS"
            ],
            required : true
        },

        orderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Order",
            default : null
        },

        status : {
            type : String,
            enum : [
                "TICKET_RAISED",
                "OPEN",
                "IN_PROGRESS",
                "RESOLVED",
                "CLOSED"
            ],
            default : "TICKET_RAISED"
        },

        adminResponse : {
            type : String,
            trim : true,
            maxlength : 1000,
            default : null
        },

        resolvedAt : {
            type : Date,
            default : null
        }
    },

    {
        timestamps : true
    }
);

supportRequestSchema.index(
    {
        userId : 1,
        createdAt : -1
    }
);

supportRequestSchema.index(
    {
        status : 1,
        createdAt : -1
    }
);

const SupportRequest = mongoose.model("SupportRequest", supportRequestSchema);

module.exports = SupportRequest;