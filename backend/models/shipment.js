const mongoose = require("mongoose");

const shipmentSchema = mongoose.Schema(
    {
        orderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Order",
            required : true,
            unique : true
        },

        status : {
            type : String,
            enum : [
                "PENDING",
                "PACKED",
                "SHIPPED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "FAILED"
            ],
            default : "PENDING"
        },

        carrier : {
            type : String,
            trim : true,
            default : null
        },

        trackingNumber : {
            type : String,
            trim : true,
            default : null
        },

        shippedAt : {
            type : Date,
            default : null
        },

        deliveredAt : {
            type : Date,
            default : null
        }
    },

    {
        timestamps : true
    }
);

shipmentSchema.index(
    {
        status : 1,
        createdAt : -1
    }
);

shipmentSchema.index(
    {
        trackingNumber : 1
    }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;