const rateLimit = require("express-rate-limit");


const createLimiter = ({
    windowMs,
    limit,
    message
}) => {

    return rateLimit({

        windowMs,
        limit,
        standardHeaders: "draft-8",
        legacyHeaders: false,

        skip: (req, res) => {
            return res.statusCode < 400 || res.statusCode >= 500;
        },

        message: {
            success: false,
            message
        }

    });

};

// --------------------------- REGISTER -------------------------------------------------------------------- //


const registrationLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message:
        "Too many registration attempts. Please try again later."
});


const registrationOtpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message:
        "Too many account verification OTP attempts. Please try again later."
});

const registrationVerifyOtpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many OTP verification attempts. Please try again later."
});

// -------------------- LOGIN ----------------------------------------------------------------//

const loginOtpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message:
        "Too many login OTP requests. Please try again later."
});


const loginLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message:
        "Too many login attempts. Please try again later."
});


//--------------------- ACCOUNT CHANGE ------------------------------------------------//

const emailChangeOtpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many email change OTP requests. Please try again later."
});

const phoneChangeOtpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many phone change OTP requests. Please try again later."
});


//----------------------------- PASSWORD --------------------------------------------------------------//

const createPasswordLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many password creation attempts. Please try again later."
});

const changePasswordLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many password change attempts. Please try again later."
});

const passwordResetOtpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many password reset OTP requests. Please try again later."
});

const resetPasswordLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many password reset attempts. Please try again later."
});

//-------------------- ORDER ---------------------------------------------------------------//

const createCartOrderLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many order attempts. Please try again later."
});

const createDirectOrderLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many buy-now attempts. Please try again later."
});

const cancelOrderLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many order cancellation attempts. Please try again later."
});




module.exports = {
    registrationLimiter,
    registrationOtpLimiter,
    registrationVerifyOtpLimiter,

    loginOtpLimiter,
    loginLimiter,

    emailChangeOtpLimiter,
    phoneChangeOtpLimiter,

    createPasswordLimiter,
    changePasswordLimiter,
    passwordResetOtpLimiter,
    resetPasswordLimiter,

    createCartOrderLimiter,
    createDirectOrderLimiter,
    cancelOrderLimiter
};