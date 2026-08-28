const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : errors.array()
        });
    };

    next();
};

module.exports = {validate};