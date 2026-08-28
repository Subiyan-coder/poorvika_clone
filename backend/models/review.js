const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        productVariantId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ProductVariant",
            required : true
        },

        orderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Order",
            required : true
        },

        rating : {
            type : Number,
            required : true,
            min : 1,
            max : 5
        },

        comment : {
            type : String,
            trim : true,
            maxlength : 500,
            default : null
        },

        isApproved : {
            type : Boolean,
            default : true
        }
    },

    {
        timestamps : true
    }
);

reviewSchema.index(
    {
        userId : 1,
        orderId : 1,
        productVariantId : 1
    },

    {
        unique : true
    }
);

reviewSchema.index(
    {
        productVariantId : 1,
        createdAt : -1
    }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;