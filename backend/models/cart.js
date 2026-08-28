const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            unique : true,
            required : true
        },

        items : [
            {
                productVariant : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "ProductVariant",
                    required : true,
                    unique : true
                },

                quantity : {
                    type : Number,
                    min : 1,
                    required : true 
                },

                selected : {
                    type : Boolean,
                    default : false
                }
            }
        ]
    },
    
    {
        timestamps : true
    }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;