const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {StatusCodes} = require("http-status-codes");

const {errorHandler} = require("./middleware/errorHandler");
const indexRoute = require("./routes/indexRoute");

const app = express();

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use("/api/v1", indexRoute);


app.get("/api/v1/health", (req, res) => {
    res.status(StatusCodes.SUCCESS).json({
        success : true,
        message : "Poorvika Api is running"
    });
});

app.use(errorHandler);


module.exports = app;