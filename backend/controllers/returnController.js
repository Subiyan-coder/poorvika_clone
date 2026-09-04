const {
    createReturn,
    getMyReturns,
    getReturn,
    getAllReturns,
    updateReturn
} = require("../services/returnService");


const create = async (req, res, next) => {

    try {

        const returnRequest = await createReturn(
            req.user._id,
            req.body.orderId,
            req.body.items
        );

        return res.status(201).json({
            success: true,
            message: "Return request created successfully",
            data: returnRequest
        });

    }
    catch (err) {
        next(err);
    }
};


const getMy = async (req, res, next) => {

    try {

        const returns = await getMyReturns(
            req.user._id
        );

        return res.status(200).json({
            success: true,
            data: returns
        });

    }
    catch (err) {
        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const returnRequest = await getReturn(
            req.user._id,
            req.params.returnId
        );

        return res.status(200).json({
            success: true,
            data: returnRequest
        });

    }
    catch (err) {
        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const returns = await getAllReturns();

        return res.status(200).json({
            success: true,
            data: returns
        });

    }
    catch (err) {
        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const returnRequest = await updateReturn(
            req.params.returnId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Return updated successfully",
            data: returnRequest
        });

    }
    catch (err) {
        next(err);
    }
};


module.exports = {
    create,
    getMy,
    getOne,
    getAll,
    update
};