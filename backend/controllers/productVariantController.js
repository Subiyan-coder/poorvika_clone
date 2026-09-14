const {
    createProductVariant,
    getAllProductVariants,
    getOneProductVariant,
    getAllProductVariantsForAdmin,
    updateProductVariant,
    updateProductVariantStatus,
    deleteProductVariant,
    addVariantImages,
    updateVariantImage,
    deleteVariantImage
} = require("../services/productVariantService");

const { logger } = require("../utils/logger");


const create = async (req, res, next) => {

    try {

        const variant = await createProductVariant(
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Product variant created successfully",
            data: variant
        });

    }
    catch (err) {

        logger.error(
            `Product variant creation failed: ${err.message}`
        );

        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const variants = await getAllProductVariants(
            req.params.productId
        );

        return res.status(200).json({
            success: true,
            data: variants
        });

    }
    catch (err) {

        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const variant = await getOneProductVariant(
            req.params.variantId
        );

        return res.status(200).json({
            success: true,
            data: variant
        });

    }
    catch (err) {

        next(err);
    }
};


const getAllForAdmin = async (req, res, next) => {

    try {

        const result =
            await getAllProductVariantsForAdmin({

                page:
                    Number(req.query.page) || 1,

                limit:
                    Number(req.query.limit) || 10,

                search:
                    req.query.search || "",

                status:
                    req.query.status || "all",

                sort:
                    req.query.sort || "newest",

                productId:
                    req.query.productId

            });

        return res.status(200).json({
            success: true,
            data: result.variants,
            pagination: result.pagination,
            counts: result.counts
        });

    }
    catch (err) {

        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const variant = await updateProductVariant(
            req.params.variantId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Product variant updated successfully",
            data: variant
        });

    }
    catch (err) {

        logger.error(
            `Product variant update failed: ${err.message}`
        );

        next(err);
    }
};


const updateStatus = async (req, res, next) => {

    try {

        const variant =
            await updateProductVariantStatus(
                req.params.variantId,
                req.body.isActive
            );

        return res.status(200).json({
            success: true,
            message:
                "Product variant status updated successfully",
            data: variant
        });

    }
    catch (err) {

        logger.error(
            `Product variant status update failed: ${err.message}`
        );

        next(err);
    }
};


const remove = async (req, res, next) => {

    try {

        const result = await deleteProductVariant(
            req.params.variantId
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    }
    catch (err) {

        logger.error(
            `Product variant deletion failed: ${err.message}`
        );

        next(err);
    }
};


const addImages = async (req, res, next) => {

    try {

        const variant = await addVariantImages(
            req.params.variantId,
            req.files
        );

        return res.status(200).json({
            success: true,
            message: "Product variant images added successfully",
            data: variant
        });

    }
    catch (err) {

        logger.error(
            `Product variant image upload failed: ${err.message}`
        );

        next(err);
    }
};


const updateImage = async (req, res, next) => {

    try {

        const variant = await updateVariantImage(
            req.params.variantId,
            req.params.imageId,
            req.file
        );

        return res.status(200).json({
            success: true,
            message: "Product variant image updated successfully",
            data: variant
        });

    }
    catch (err) {

        logger.error(
            `Product variant image update failed: ${err.message}`
        );

        next(err);
    }
};


const removeImage = async (req, res, next) => {

    try {

        const variant = await deleteVariantImage(
            req.params.variantId,
            req.params.imageId
        );

        return res.status(200).json({
            success: true,
            message: "Product variant image deleted successfully",
            data: variant
        });

    }
    catch (err) {

        logger.error(
            `Product variant image deletion failed: ${err.message}`
        );

        next(err);
    }
};



module.exports = {
    create,
    getAll,
    getOne,
    getAllForAdmin,
    update,
    updateStatus,
    remove,
    addImages,
    updateImage,
    removeImage
};