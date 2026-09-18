const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
            enum: [
                "Mobiles",
                "Mobile Accessories",
                "Computers",
                "Tablets",
                "TV",
                "Audio",
                "Kitchen Appliances",
                "Home Appliances",
                "Smart Technology",
                "Personal",
                "Health Care"
            ],
            trim: true
        },
        
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