const {
    createReview,
    getProductReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    getAllReviewsForAdmin,
    disapproveReview
} = require("../services/reviewService");

const { logger } = require("../utils/logger");


const create = async (req, res, next) => {

    try {

        const review = await createReview({
            userId: req.user.userId,
            productVariantId: req.body.productVariantId,
            orderId: req.body.orderId,
            rating: req.body.rating,
            comment: req.body.comment,
            images: req.files
        });

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });

    }
    catch (err) {

        logger.error(
            `Review creation failed: ${err.message}`
        );

        next(err);
    }
};

const getProduct = async (req, res, next) => {

    try {

        const reviews = await getProductReviews(
            req.params.productVariantId
        );

        return res.status(200).json({
            success: true,
            data: reviews
        });

    }
    catch (err) {

        logger.error(
            `Product reviews retrieval failed: ${err.message}`
        );

        next(err);
    }
};


const getMine = async (req, res, next) => {

    try {

        const reviews = await getMyReviews(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            data: reviews
        });

    }
    catch (err) {

        logger.error(
            `User reviews retrieval failed: ${err.message}`
        );

        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const review = await updateReview(
            req.user.userId,
            req.params.reviewId,
            req.body.rating,
            req.body.comment,
            req.files,
            req.body.removedImagePublicIds
        );

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });

    }
    catch (err) {

        logger.error(
            `Review update failed: ${err.message}`
        );

        next(err);
    }
};

const remove = async (req, res, next) => {

    try {

        const review = await deleteReview(
            req.user.userId,
            req.params.reviewId
        );

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: review
        });

    }
    catch (err) {

        logger.error(
            `Review deletion failed: ${err.message}`
        );

        next(err);
    }
};


const getAllForAdmin = async (
    req,
    res,
    next
) => {

    try {

        const reviews =
            await getAllReviewsForAdmin();

        return res.status(200).json({
            success: true,
            data: reviews
        });

    }
    catch (err) {

        logger.error(
            `Admin review retrieval failed: ${err.message}`
        );

        next(err);
    }
};


const disapprove = async (
    req,
    res,
    next
) => {

    try {

        const review = await disapproveReview(
            req.params.reviewId
        );

        return res.status(200).json({
            success: true,
            message: "Review disapproved successfully",
            data: review
        });

    }
    catch (err) {

        logger.error(
            `Review disapproval failed: ${err.message}`
        );

        next(err);
    }
};


module.exports = {
    create,
    getProduct,
    getMine,
    update,
    remove,
    getAllForAdmin,
    disapprove
};