const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },

        email : {
            type : String,
            unique : true,
            lowercase : true,
            trim : true
        },

        phone : {
            type : String,
            unique : true,
            trim : true
        },

        password : {
            type : String
        },

        role : {
            type : String,
            enum : ["ADMIN", "CUSTOMER"],
            default : "CUSTOMER"
        },

        isVerified : {
            type : Boolean,
            default : false
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


const User = mongoose.model("User", userSchema);

module.exports = User;