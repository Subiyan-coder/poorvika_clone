const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        categoryId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Category",
            required : true
        },

        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            required : true
        },

        productVariantId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ProductVariant",
            required : true,
            unique : true
        },

        quantity : {
            type : Number,
            min : 0,
            validate : {
                validator : Number.isInteger,
                message : "Quantity must be an integer"
            },
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
            default : 10
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


inventorySchema.index({
    categoryId : 1,
    quantity : 1,
    reservedQuantity : 1
});


inventorySchema.index({
    productId : 1,
    quantity : 1,
    reservedQuantity : 1
});


inventorySchema.index({
    productVariantId : 1,
    quantity : 1,
    reservedQuantity : 1
});


const Inventory = mongoose.model(
    "Inventory",
    inventorySchema
);

module.exports = Inventory;