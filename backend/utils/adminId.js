const AdminCounter = require("../models/adminCounter");

const generateAdminId = async () => {

    const counter = await AdminCounter.findOneAndUpdate(
        {
            _id: "ADMIN"
        },
        {
            $inc: {
                sequence: 1
            }
        },
        {
            new: true,
            upsert: true
        }
    );

    return `ADM-${String(counter.sequence).padStart(2, "0")}`;
};

module.exports = {
    generateAdminId
};