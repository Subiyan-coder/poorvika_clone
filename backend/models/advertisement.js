const mongoose = require("mongoose");


const advertisementSchema = new mongoose.Schema(
    {

        title: {
            type: String,
            required: true,
            trim: true
        },


        image: {

            url: {
                type: String,
                required: true,
                trim: true
            },

            publicId: {
                type: String,
                required: true,
                trim: true
            }

        },


        link: {
            type: String,
            default: null,
            trim: true
        },


        placement: {
            type: String,
            enum: [
                "LOGIN",
                "HOME",
                "PRODUCT"

            ],
            required: true,
            index: true
        },


        status: {
            type: String,
            enum: [
                "ACTIVE",
                "INACTIVE"
            ],
            default: "INACTIVE",
            index: true
        },


        startDate: {
            type: Date,
            default: null
        },


        endDate: {
            type: Date,
            default: null
        },


        priority: {
            type: Number,
            default: 0
        },


        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },
    {
        timestamps: true
    }
);


advertisementSchema.index({
    placement: 1,
    status: 1,
    priority: -1
});


module.exports = mongoose.model(
    "Advertisement",
    advertisementSchema
);