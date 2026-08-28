const {StatusCodes} = require("http-status-codes");
const authSerivice = require("../services/authServices");
const {logger} = require("../utils/logger");
const {setAuthCookies} = require("../utils/cookie");

const register = async (req, res, next) => {
    try {
        const result = await authSerivice.register(req.body);

        return res.status(StatusCodes.OK).json(
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

const verifyRegistrationOtp = async (req, res, next) => {
    try{
        const result = await authSerivice.verifyRegistrationOtp(req.body);

        setAuthCookies(
            res,
            result.accessToken,
            result.refreshToken
        )

        return res.status(StatusCodes.CREATED).json(
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
}

module.exports = {register, verifyRegistrationOtp};