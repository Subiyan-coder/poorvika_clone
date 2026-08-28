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

        description : {
            type : String,
            maxlength : 500,
            trim : true
        },

        images : {
            url : {
                type : String,
                trim : true
            },
            
            publicId : {
                type : String,
                trim : true
            }
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

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;