const app = require("./app");
const {connectDB} = require("./config/db");
const {config} = require("./config/env")


const startServer = async() => {
    await connectDB();

    app.listen(config.port, () => {
        console.log(`Poorvika is running on server ${config.port}`);
    })
};

startServer();