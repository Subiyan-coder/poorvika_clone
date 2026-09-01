const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {StatusCodes} = require("http-status-codes");
const authRoutes = require("./routes/authRoute");
const {errorHandler} = require("./middleware/errorHandler");
const customerProfileRoute = require("./routes/customerProfileRoute");
const addressRoute = require("./routes/addressRoute");
const passwordRoute = require("./routes/passwordRoute");
const accountRoute = require("./routes/accountRoute")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/customer", customerProfileRoute);
app.use("/api/v1/customer/addresses", addressRoute);
app.use("/api/v1/customer/password", passwordRoute);
app.use("/api/v1/customer/account", accountRoute);

app.get('/api/v1/health', (req, res) => {
    res.status(StatusCodes.SUCCESS).json({
        success : true,
        message : "Poorvika Api is running"
    });
});

app.use(errorHandler);


module.exports = app;