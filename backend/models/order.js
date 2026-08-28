const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        orderNumber: {
            type: String,
            required: true,
            unique: true,
            immutable: true,
            trim: true
        },

        items: [
            {
                productVariantId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductVariant",
                    required: true
                },

                productName: {
                    type: String,
                    required: true,
                    trim: true
                },

                sku: {
                    type: String,
                    required: true,
                    trim: true
                },

                attributes: {
                    type: Map,
                    of: String
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                unitPrice: {
                    type: Number,
                    required: true,
                    min: 0
                },

                totalPrice: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],

        shippingAddress: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            },

            alternativePhone: {
                type: String,
                trim: true
            },

            houseNo: {
                type: String,
                trim: true
            },

            addressLine1: {
                type: String,
                required: true,
                trim: true
            },

            addressLine2: {
                type: String,
                trim: true
            },

            area: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            postalCode: {
                type: String,
                required: true,
                trim: true
            },

            country: {
                type: String,
                required: true,
                trim: true
            }
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        discountAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        shippingCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "CONFIRMED",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
                "RETURNED"
            ],
            default: "PENDING"
        },

        placedAt: {
            type: Date,
            default: Date.now
        },
        
        deliveredAt : {
            type : Date,
            default : null
        },

        returnDeadline : {
            type : Date,
            default : null
        },

        cancelledAt : {
            type : Date,
            default : null
        },

        cancellationReason : {
            type : String,
            trim : true,
            default : null
        }
    },
    {
        timestamps: true
    }
);

orderSchema.index({
    userId: 1,
    createdAt: -1
});

orderSchema.index({
    status: 1,
    createdAt: -1
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;