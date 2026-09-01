const {logger} = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    const statusCode = err.StatusCode || 500;

    logger.error(
        {
            message : err.message,
            method : req.method,
            url : req.originalUrl,
            statusCode,
            stack : err.stack
        }
    );

    return res.status(statusCode).json(
        {
            success : false,
            message : err.message || "Internal Server Error"
        }
    )
};

module.exports = {errorHandler};