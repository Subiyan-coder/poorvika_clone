const {
    getCurrentUser
} = require("../services/accountService");

const {
    registerService,
    requestRegistrationOtp,
    verifyAccountOtp
} = require("../services/registerService");

const {
    loginService,
    requestLoginOtp,
    logoutService
} = require("../services/loginService");

const { logger } = require("../utils/logger");

const {
    setAuthCookies,
    clearAuthCookies
} = require("../utils/cookie");

const {
    refreshAccessToken
} = require("../services/refreshTokenService");



const register = async (req, res, next) => {

    try {

        const result = await registerService(
            req.body
        );


        setAuthCookies(
            res,
            result.accessToken,
            result.refreshToken
        );


        return res.status(201).json({

            success: true,
            message: "Registration completed successfully",
            data: {
                user: {
                    id: result.user._id,
                    name: result.user.name,
                    email: result.user.email,
                    phone: result.user.phone,
                    role: result.user.role
                }
            }

        });

    }
    catch (err) {

        logger.error(
            `Registration failed : ${err.message}`
        );

        next(err);

    }

};


const registrationOtp = async (req, res, next) => {

    try {

        const result = await requestRegistrationOtp(
            req.body
        );


        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: result
        });

    }
    catch (err) {

        logger.error(
            `Registration OTP request failed : ${err.message}`
        );

        next(err);

    }

};


const verifyRegistrationOtp = async (
    req,
    res,
    next
) => {

    try {

        const result = await verifyAccountOtp(
            req.body
        );


        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: result
        });

    }
    catch (err) {

        logger.error(
            `Registration OTP verification failed : ${err.message}`
        );

        next(err);

    }

};


const login = async (req, res, next) => {

    try {

        const result = await loginService(
            req.body
        );


        setAuthCookies(
            res,
            result.data.accessToken,
            result.data.refreshToken
        );


        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                user: result.data.user
            }
        });

    }
    catch (err) {
        next(err);
    }

};


const loginOtp = async (req, res, next) => {

    try {

        const result = await requestLoginOtp(
            req.body
        );


        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });

    }
    catch (err) {
        next(err);
    }

};


const logout = async (req, res, next) => {

    try {

        const refreshToken =
            req.cookies.refreshToken;


        const result =
            await logoutService(
                refreshToken
            );


        clearAuthCookies(res);


        return res.status(200).json({
            success: true,
            message: result.message
        });

    }
    catch (err) {
        next(err);
    }

};

const refresh = async (
    req,
    res,
    next
) => {

    try {

        const refreshToken =
            req.cookies.refreshToken;

        const result =
            await refreshAccessToken(
                refreshToken
            );


        setAuthCookies(
            res,
            result.accessToken,
            result.refreshToken
        );


        return res.status(200).json({

            success: true,

            message:
                "Token refreshed successfully"

        });

    }
    catch (err) {

        next(err);

    }

};

const me = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await getCurrentUser(
                req.user.userId
            );

        return res.status(200).json({

            success: true,

            data: {
                user
            }

        });

    }
    catch (err) {

        next(err);

    }

};


module.exports = {
    register,
    registrationOtp,
    verifyRegistrationOtp,
    login,
    loginOtp,
    logout,
    refresh,
    me
};