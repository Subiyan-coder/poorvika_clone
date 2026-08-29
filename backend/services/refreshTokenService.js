const RefreshToken = require("../models/refreshToken");
const {generateRefreshToken, hashToken} = require("../utils/jwt");
const {config} = require("../config/env");
const {parseDuration} = require("../utils/time");

const createRefreshToken = async (userId, userRole) => {

    const payload = {
        userId,
        userRole
    };

    const refreshToken = generateRefreshToken(payload);

    const tokenHash = hashToken(refreshToken);

    const expiresAt = new Date(
        Date.now() + parseDuration(config.jwt.refreshExpiresIn)
    );

    await RefreshToken.create({
        userId,
        tokenHash,
        expiresAt
    });

    return refreshToken;
};

module.exports = {createRefreshToken};