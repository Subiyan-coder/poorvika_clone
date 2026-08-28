const mongoose = require("mongoose");
const {config} = require("./env")

const connectDB = async() => {
    try {
        const connection = await mongoose.connect(config.mongouri);

        console.log(`MongoDB is connected to ${connection.connection.host}`);
    }
    catch(err){
        console.error("MongoDB connection failed", err.message);
        process.exit(1);
    }
};

module.exports = {connectDB};