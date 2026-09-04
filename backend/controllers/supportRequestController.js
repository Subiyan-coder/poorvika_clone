const {
    createSupportRequest,
    getMySupportRequests,
    getSupportRequest,
    closeSupportRequest,
    getAllSupportRequests,
    updateSupportRequest
} = require("../services/supportRequestService");

const { logger } = require("../utils/logger");


const create = async (req, res, next) => {

    try {

        const supportRequest =
            await createSupportRequest({
                userId: req.user.userId,
                subject: req.body.subject,
                message: req.body.message,
                category: req.body.category,
                orderId: req.body.orderId
            });

        return res.status(201).json({
            success: true,
            message: "Support request created successfully",
            data: supportRequest
        });

    }
    catch (err) {

        logger.error(
            `Support request creation failed: ${err.message}`
        );

        next(err);
    }
};


const getMine = async (req, res, next) => {

    try {

        const supportRequests =
            await getMySupportRequests(
                req.user.userId
            );

        return res.status(200).json({
            success: true,
            data: supportRequests
        });

    }
    catch (err) {

        logger.error(
            `User support requests retrieval failed: ${err.message}`
        );

        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const supportRequest =
            await getSupportRequest(
                req.user.userId,
                req.params.supportRequestId
            );

        return res.status(200).json({
            success: true,
            data: supportRequest
        });

    }
    catch (err) {

        logger.error(
            `Support request retrieval failed: ${err.message}`
        );

        next(err);
    }
};


const close = async (req, res, next) => {

    try {

        const supportRequest =
            await closeSupportRequest(
                req.user.userId,
                req.params.supportRequestId
            );

        return res.status(200).json({
            success: true,
            message: "Support request closed successfully",
            data: supportRequest
        });

    }
    catch (err) {

        logger.error(
            `Support request closing failed: ${err.message}`
        );

        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const supportRequests =
            await getAllSupportRequests();

        return res.status(200).json({
            success: true,
            data: supportRequests
        });

    }
    catch (err) {

        logger.error(
            `Admin support requests retrieval failed: ${err.message}`
        );

        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const supportRequest =
            await updateSupportRequest(
                req.params.supportRequestId,
                {
                    status: req.body.status,
                    adminResponse: req.body.adminResponse
                }
            );

        return res.status(200).json({
            success: true,
            message: "Support request updated successfully",
            data: supportRequest
        });

    }
    catch (err) {

        logger.error(
            `Support request update failed: ${err.message}`
        );

        next(err);
    }
};


module.exports = {
    create,
    getMine,
    getOne,
    close,
    getAll,
    update
};