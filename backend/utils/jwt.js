const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {config} = require("../config/env");

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};
 
const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        config.jwt.accessSecret,
        {
            expiresIn : config.jwt.accessExpiresIn
        }
    );
};

const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        config.jwt.refreshSecret,
        {
            expiresIn : config.jwt.refreshExpiresIn
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        config.jwt.accessSecret
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        config.jwt.refreshSecret
    );
};

module.exports = {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken};