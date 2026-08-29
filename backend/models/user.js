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
            lowercase : true,
            trim : true
        },

        phone : {
            type : String,
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

userSchema.index(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: {
            email: { $exists: true, $ne: null }
        }
    }
);

userSchema.index(
    { phone: 1 },
    {
        unique: true,
        partialFilterExpression: {
            phone: { $exists: true, $ne: null }
        }
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;