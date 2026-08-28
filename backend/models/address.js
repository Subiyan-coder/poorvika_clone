const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {

        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        type : {
            type : String,
            enum : ["HOME", "OFFICE", "OTHER"],
            default : "HOME"
        },

        name : {
            type : String,
            required : true,
            trim : true,
            maxlength : 100
        },

        phone : {
            type : String,
            required : true,
            trim : true
        },

        alternativePhone : {
            type : String,
            trim : true
        },

        houseNo : {
            type : String,
            trim : true,
            maxlength : 10
        },

        addressLine1 : {
            type : String,
            required : true,
            trim : true,
            maxlength : 200 
        },

        addressLine2 : {
            type : String,
            trim : true,
            maxlength : 200
        },

        postalCode : {
            type : String,
            required : true,
            trim : true
        },

        area : {
            type : String,
            required : true,
            trim : true
        },

        city : {
            type : String,
            required : true,
            trim : true
        },

        state : {
            type : String,
            required : true,
            trim : true
        },

        country : {
            type : String,
            required : true,
            trim : true
        },

        isDefault : {
            type : Boolean,
            default : false
        }

    },

    {
        timestamps : true
    }
);

addressSchema.index(
    {
        userId : 1,
        isDefault : 1
    },

    {
        unique : true,
        partialFilterExpression : {
            isDefault : true
        }
    }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;