const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code : {
            type : String,
            required : true,
            unique : true,
            uppercase : true,
            trim : true,
            maxlength : 20
        },

        discountType : {
            type : String,
            enum : ["PERCENTAGE", "FIXED"],
            required : true
        },

        discountValue : {
            type : Number,
            required : true,
            min : 0
        },

        minimumOrderValue : {
            type : Number,
            default : null,
            min : 0
        },

        maximumDiscountValue : {
            type : Number,
            default : 0,
            min : 0
        },

        validFrom : {
            type : Date,
            required : true
        },

        validUntil : {
            type : Date,
            required : true
        },

        usageLimit : {
            type : Number,
            default : null,
            min : 0
        },

        usedCount : {
            type : Number,
            default : 0,
            min : 0
        },

        applicableProducts : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product"
            }
        ],

        applicableCategories : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Category"
            }
        ],

        isActive : {
            type : Boolean,
            default : false
        }
    },

    {
        timestamps : true
    }
);

couponSchema.index(
    {
        isActive : 1,
        validFrom : 1,
        validUntil : 1
    }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;