const {StatusCodes}  = require("http-status-codes");
const {logger} = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    const statusCode = err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR;

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