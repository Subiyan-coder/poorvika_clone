const Review = require("../models/review");
const Order = require("../models/order");
const {
    uploadImage,
    deleteImage
} = require("../services/cloudinaryService");


const createReview = async ({
    userId,
    orderId,
    productVariantId,
    rating,
    comment,
    images
}) => {

    const order = await Order.findOne({
        _id: orderId,
        userId
    });

    if (!order) {
        const error = new Error(
            "Order not found"
        );
        error.statusCode = 404;
        throw error;
    }


    if (order.status !== "DELIVERED") {
        const error = new Error(
            "You can review products only after the order is delivered"
        );
        error.statusCode = 400;
        throw error;
    }


    const orderItem = order.items.find(
        item =>
            item.productVariantId.toString() ===
            productVariantId.toString()
    );

    if (!orderItem) {
        const error = new Error(
            "You can only review products purchased in this order"
        );
        error.statusCode = 400;
        throw error;
    }


    const existingReview = await Review.findOne({
        userId,
        orderId,
        productVariantId
    });

    if (existingReview) {
        const error = new Error(
            "You have already reviewed this product for this order"
        );
        error.statusCode = 409;
        throw error;
    }


    const uploadedImages = [];

    try {

        if (images && images.length > 0) {

            for (const image of images) {

                const uploadedImage =
                    await uploadImage(
                        image.buffer,
                        "reviews"
                    );

                uploadedImages.push(
                    uploadedImage
                );
            }
        }


        const review = await Review.create({
            userId,
            orderId,
            productVariantId,
            rating,
            comment: comment || null,
            images: uploadedImages
        });


        return review;

    }
    catch (err) {

        for (const image of uploadedImages) {

            try {
                await deleteImage(
                    image.publicId
                );
            }
            catch (cleanupError) {
                console.error(
                    `Failed to cleanup review image: ${cleanupError.message}`
                );
            }
        }

        throw err;
    }
};


const getProductReviews = async (
    productVariantId
) => {

    return Review.find({
        productVariantId,
        isApproved: true
    })
        .populate(
            "userId",
            "name"
        )
        .sort({
            createdAt: -1
        });
};


const getMyReviews = async (userId) => {

    return Review.find({
        userId
    })
        .populate(
            "productVariantId",
            "sku attributes"
        )
        .populate(
            "orderId",
            "orderNumber"
        )
        .sort({
            createdAt: -1
        });
};


const updateReview = async (
    userId,
    reviewId,
    rating,
    comment,
    newImages,
    removedImagePublicIds
) => {

    const review = await Review.findOne({
        _id: reviewId,
        userId
    });

    if (!review) {
        const error = new Error(
            "Review not found"
        );
        error.statusCode = 404;
        throw error;
    }


    if (rating !== undefined) {
        review.rating = rating;
    }


    if (comment !== undefined) {
        review.comment =
            comment || null;
    }


    if (
        removedImagePublicIds &&
        removedImagePublicIds.length > 0
    ) {

        for (
            const publicId
            of removedImagePublicIds
        ) {

            const imageExists =
                review.images.some(
                    image =>
                        image.publicId === publicId
                );

            if (!imageExists) {
                const error = new Error(
                    "One or more images do not belong to this review"
                );
                error.statusCode = 400;
                throw error;
            }
        }
    }


    const uploadedImages = [];

    try {

        if (
            newImages &&
            newImages.length > 0
        ) {

            for (const image of newImages) {

                const uploadedImage =
                    await uploadImage(
                        image.buffer,
                        "reviews"
                    );

                uploadedImages.push(
                    uploadedImage
                );
            }
        }


        if (
            removedImagePublicIds &&
            removedImagePublicIds.length > 0
        ) {

            review.images =
                review.images.filter(
                    image =>
                        !removedImagePublicIds.includes(
                            image.publicId
                        )
                );
        }


        review.images.push(
            ...uploadedImages
        );


        await review.save();


        if (
            removedImagePublicIds &&
            removedImagePublicIds.length > 0
        ) {

            for (
                const publicId
                of removedImagePublicIds
            ) {

                try {
                    await deleteImage(
                        publicId
                    );
                }
                catch (cleanupError) {
                    console.error(
                        `Failed to delete old review image: ${cleanupError.message}`
                    );
                }
            }
        }


        return review;

    }
    catch (err) {
        
        for (
            const image
            of uploadedImages
        ) {

            try {
                await deleteImage(
                    image.publicId
                );
            }
            catch (cleanupError) {
                console.error(
                    `Failed to cleanup new review image: ${cleanupError.message}`
                );
            }
        }

        throw err;
    }
};

const deleteReview = async (
    userId,
    reviewId
) => {

    const review = await Review.findOne({
        _id: reviewId,
        userId
    });

    if (!review) {
        const error = new Error(
            "Review not found"
        );
        error.statusCode = 404;
        throw error;
    }


    if (
        review.images &&
        review.images.length > 0
    ) {

        for (const image of review.images) {

            await deleteImage(
                image.publicId
            );
        }
    }


    await review.deleteOne();


    return review;
};


const getAllReviewsForAdmin = async () => {

    return Review.find()
        .populate(
            "userId",
            "name email"
        )
        .populate(
            "productVariantId",
            "sku attributes"
        )
        .populate(
            "orderId",
            "orderNumber"
        )
        .sort({
            createdAt: -1
        });
};

const disapproveReview = async (
    reviewId
) => {

    const review = await Review.findById(
        reviewId
    );

    if (!review) {
        const error = new Error(
            "Review not found"
        );
        error.statusCode = 404;
        throw error;
    }


    if (!review.isApproved) {
        return review;
    }


    review.isApproved = false;

    await review.save();


    return review;
};

module.exports = {
    createReview,
    getProductReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    getAllReviewsForAdmin,
    disapproveReview
};