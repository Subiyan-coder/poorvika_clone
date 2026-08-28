const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        categoryId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Category",
            required : true
        },

        name : {
            type : String,
            required : true,
            maxlength : 500,
            trim : true
        },

        slug : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },

        description : {
            type : String,
            required : true,
            trim : true
        },

        brand : {
            type : String,
            required : true,
            trim : true,
            maxlength : 100
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

        specification : {
            type : Map,
            of : String
        },

        isActive : {
            type : Boolean,
            default : true
        }
    },

    {
        timestamps : true
    }
);

productSchema.index(
    {
        categoryId : 1,
        isActive : 1
    }
);

productSchema.index(
    {
        name : "text",
        brand : "text",
        description : "text"
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
