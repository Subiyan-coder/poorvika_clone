const mongoose = require("mongoose");

const adminCounterSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },

        sequence: {
            type: Number,
            default: 0
        }
    }
);

const AdminCounter = mongoose.model(
    "AdminCounter",
    adminCounterSchema
);

module.exports = AdminCounter;