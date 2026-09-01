const {
    createProductVariant,
    getAllProductVariants,
    getOneProductVariant,
    getAllProductVariantsForAdmin,
    updateProductVariant,
    updateProductVariantStatus,
    deleteProductVariant
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

        const variants =
            await getAllProductVariantsForAdmin(
                req.query.productId
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


module.exports = {
    create,
    getAll,
    getOne,
    getAllForAdmin,
    update,
    updateStatus,
    remove
};