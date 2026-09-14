const { connectDB } = require("./config/db");
const { config } = require("./config/env");
const { hashPassword } = require("./services/passwordService");
const User = require("./models/user");

const createAdmin = async () => {

    try {

        await connectDB();


        const existingAdmin = await User.findOne({
            email : config.admin.adminEmail
        });

        if (existingAdmin) {

            console.log(
                "Admin account already exists."
            );

            process.exit(0);
        }


        const passwordHash = await hashPassword(
            config.admin.adminPassword
        );


        const admin = await User.create({

            name: config.admin.adminName,

            email: config.admin.adminEmail,

            password: passwordHash,

            role: "ADMIN",

            isVerified: true,

            isActive: true

        });


        console.log(
            `Admin account created successfully: ${admin.email}`
        );

        process.exit(0);

    }
    catch (err) {

        console.error(
            "Failed to create admin:",
            err.message
        );

        process.exit(1);
    }
};


createAdmin();