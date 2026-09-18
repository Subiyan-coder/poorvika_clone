require("dotenv").config({
    path: require("path").join(__dirname, "../.env")
});

console.log(
    "ACCESS:",
    process.env.JWT_ACCESS_EXPIRES_IN
);

console.log(
    "REFRESH:",
    process.env.JWT_REFRESH_EXPIRES_IN
);

const { connectDB } = require("../config/db");
const ProductVariant = require("../models/productVariant");


const variants = async () => {

    await connectDB();

    const variant = await ProductVariant
        .find()
        .select("_id");

    console.log(
        variant
            .map(v => v._id)
            .join("\n")
    );

};

variants();