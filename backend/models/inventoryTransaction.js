const mongoose = require("mongoose");

const inventoryTransactionSchema = new mongoose.Schema(
    {
        productVariantId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ProductVariant",
            required : true
        },

        type : {
            type : String,
            enum : [
                "PURCHASE",
                "SALE",
                "RETURN",
                "ADJUSTMENT",
                "DAMAGE",
                "RESERVATION",
                "RELEASE"
            ],
            required : true
        },

        quantity : {
            type : Number,
            min : 1,
            required : true
        },

        referenceId : {
            type : mongoose.Schema.Types.ObjectId,
            default : null
        },
        
        note : {
            type : String,
            maxlength : 500,
            trim : true
        }
    },

    {
        timestamps : true
    }
);

inventoryTransactionSchema.index(
    {
        productVariantId : 1,
        createdAt : -1
    }
);

inventoryTransactionSchema.index(
    {
        type : 1,
        createdAt : -1
    }
);

const InventoryTransaction = mongoose.model("InventoryTransaction", inventoryTransactionSchema);

module.exports = InventoryTransaction;