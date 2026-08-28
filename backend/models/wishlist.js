const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        name : {
            type : String,
            maxlength : 20,
            trim : true,
            default : "Favourites"
        },

        variants : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "ProductVariant"
            }
        ]
    },
    
    {
        timestamps : true
    }
);

wishlistSchema.index(
    { userId: 1, name: 1 },
    { unique: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;