const {registerService, verifyAccountOtp} = require("../services/registerService");
const {loginService, requestLoginOtp, logoutService} = require("../services/loginService");
const {logger} = require("../utils/logger");
const {setAuthCookies, clearAuthCookies} = require("../utils/cookie");

const register = async (req, res, next) => {
    try {
        const result = await registerService(req.body);

        return res.status(201).json(
            {
                success : true,
                message : result.message,
                data : result.data
            }
        );
    } 
    catch(err){
        logger.error(`Registration failed : ${err.message}`);
        next(err);
    }
};

const registrationOtp = async (req, res, next) => {
    try{
        const result = await verifyAccountOtp(req.body);

        setAuthCookies(
            res,
            result.accessToken,
            result.refreshToken
        )

        return res.status(201).json(
            {
                success : true,
                message : "Registration completed successfully",
                data : {
                    id : result.user._id,
                    name : result.user.name,
                    email : result.user.email,
                    phone : result.user.phone,
                    role : result.user.role
                }
            }
        )
    }
    catch(err){
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await loginService(req.body);

        setAuthCookies(
            res,
            result.data.accessToken,
            result.data.refreshToken
        );

        return res.status(200).json(
            {
                success : true,
                message : result.message,
                data : {
                    user : result.data.user
                }
            }
        );
    }
    catch(err){
        next(err);
    }
};

const loginOtp = async (req, res, next) => {
    try {
        const result = await requestLoginOtp(req.body);

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });
    }
    catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {

    try {

        const refreshToken = req.cookies.refreshToken;

        const result = await logoutService(refreshToken);

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

module.exports = {register, registrationOtp, login, loginOtp, logout};