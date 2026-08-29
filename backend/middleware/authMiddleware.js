const jwt = require("jsonwebtoken");
const {config} = require("../config/env");
const {logger} = require("../utils/logger");

const authenticate = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if(!accessToken) {
            const error = new Error("Authentication required");
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(
            accessToken, 
            config.jwt.accessSecret
        );

        req.user = {
            userId : decoded.userId,
            userRole : decoded.userRole
        };

        next();
    }
    catch(err){
        logger.warn(`Authentication Failed ${err.message}`);

        if(err.name === "TokenExpiredError") {
            err.statusCode = 401;
            err.message = "AccessToken Expired";
        }

        if(err.name === "JsonWebTokenError") {
            err.statusCode = 401;
            err.message = "Invalid AccessToken"
        }

        next(err)
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user) {
            const error = new Error("Authentication required");
            error.statusCode = 401;
            return next(error);
        }

        if (!allowedRoles.includes(req.user.userRole)) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            return next(error);
        }

        next();
    }
}

module.exports = {authenticate, authorize};