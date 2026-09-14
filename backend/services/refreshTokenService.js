const RefreshToken = require("../models/refreshToken");

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken
} = require("../utils/jwt");

const { config } = require("../config/env");


// -------------------------
// Create Refresh Token
// -------------------------

const createRefreshToken = async (userId, userRole) => {

    const payload = {
        userId,
        userRole
    };

    const refreshToken =
        generateRefreshToken(payload);

    const tokenHash =
        hashToken(refreshToken);

    const expiresAt = new Date(
        Date.now() + config.jwt.refreshExpiresIn
    );


    const activeTokens =
        await RefreshToken.find({
            userId,
            revokedAt: null
        })
        .sort({
            createdAt: 1
        });


    if (activeTokens.length >= 3) {

        await RefreshToken.findByIdAndUpdate(
            activeTokens[0]._id,
            {
                revokedAt: new Date()
            }
        );
    }


    await RefreshToken.create({
        userId,
        tokenHash,
        expiresAt
    });


    return refreshToken;
};


// -------------------------
// Refresh Access Token
// -------------------------

const refreshAccessToken = async (
    refreshToken
) => {

    if (!refreshToken) {

        const error = new Error(
            "Refresh token required"
        );

        error.statusCode = 401;

        throw error;
    }


    let decoded;

    try {

        decoded =
            verifyRefreshToken(
                refreshToken
            );

    }
    catch (error) {

        error.statusCode = 401;
        error.message = "Invalid or expired refresh token";

        throw error;
    }


    const tokenHash =
        hashToken(refreshToken);


    const storedToken =
        await RefreshToken.findOne({
            tokenHash,
            revokedAt: null
        });


    if (!storedToken) {

        const error = new Error(
            "Invalid or revoked refresh token"
        );

        error.statusCode = 401;

        throw error;
    }


    if (
        storedToken.expiresAt <=
        new Date()
    ) {

        const error = new Error(
            "Refresh token expired"
        );

        error.statusCode = 401;

        throw error;
    }


    // Revoke old refresh token

    storedToken.revokedAt =
        new Date();

    await storedToken.save();


    // Create new access token

    const accessToken =
        generateAccessToken({
            userId: decoded.userId,
            userRole: decoded.userRole
        });


    // Create new refresh token

    const newRefreshToken =
        await createRefreshToken(
            decoded.userId,
            decoded.userRole
        );


    return {
        accessToken,
        refreshToken: newRefreshToken
    };
};


module.exports = {
    createRefreshToken,
    refreshAccessToken
};