const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        productVariantId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ProductVariant",
            required : true,
            unique : true
        },

        quantity : {
            type : Number,
            min : 0,
            default : 0
        },
        
        reservedQuantity : {
            type : Number,
            min : 0,
            default : 0
        },

        lowStockThreshold : {
            type : Number,
            min : 0,
            default : 5
        },

        isAvailable : {
            type : Boolean,
            default : true
        }
    },

    {
        timestamps : true
    }
);

inventorySchema.index(
    {
        quantity : 1, isAvailable : 1
    }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;