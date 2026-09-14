const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name : {
            type : String,
            maxlength : 100,
            required : true,
            unique : true,
            trim : true
        },
        
        slug : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },

        sku : {
            type : String,
            required : true,
            unique : true,
            uppercase : true,
            trim : true
        },

        description : {
            type : String,
            maxlength : 500,
            trim : true
        },

        images : {
            url : {
                type : String,
                trim : true,
                required : true
            },
            
            publicId : {
                type : String,
                trim : true,
                required : true
            }
        },

        activeProductCount : {
            type : Number,
            default : 0,
            min : 0
        },

        inactiveProductCount : {
            type : Number,
            default : 0,
            min : 0
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

categorySchema.index({
    isActive : 1
});

categorySchema.index({
    activeProductCount : -1
});

categorySchema.index({
    inactiveProductCount : -1
});


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;