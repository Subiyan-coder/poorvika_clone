const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
    {
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            required : true
        },

        sku : {
            type : String,
            required : true,
            unique : true,
            uppercase : true,
            trim : true
        },

        price : {
            type : Number,
            required : true,
            min : 0
        },

        discountPercentage : {
            type : Number,
            default : 0
        },

        discountPrice : {
            type : Number,
            min : 0,
            default : 0
        },

        color : {
            type : String,
            required : true,
            trim : true
        },

        attributes : {
            type : Map,
            of : String
        },

        images : [
            {
                url : {
                    type : String,
                    required : true,
                    trim : true
                },

                publicId : {
                    type : String,
                    required : true,
                    trim : true
                }
            }
        ],

        isActive : {
            type : Boolean,
            default : true
        }

    },

    {
        timestamps : true
    }
);

productVariantSchema.index(
    {
        productId : 1,
        isActive : 1
    }
);

productVariantSchema.index(
    {
        sku : 1,
        isActive : 1
    }
);

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

module.exports = ProductVariant;