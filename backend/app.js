const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {StatusCodes} = require("http-status-codes");
const authRoutes = require("./routes/authRoute");
const {errorHandler} = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes)

app.get('/api/v1/health', (req, res) => {
    res.status(StatusCodes.SUCCESS).json({
        success : true,
        message : "Poorvika Api is running"
    });
});

app.use(errorHandler);


module.exports = app;