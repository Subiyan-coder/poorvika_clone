const {
    createProduct,
    getAllProducts,
    getOneProduct,
    getAllProductsForAdmin,
    updateProduct,
    updateProductStatus,
    deleteProduct,
    addProductImages,
    updateProductImage,
    deleteProductImage
} = require("../services/productService");

const { logger } = require("../utils/logger");


const create = async (req, res, next) => {

    try {

        const product = await createProduct(req.body);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    }
    catch (err) {

        logger.error(
            `Product creation failed: ${err.message}`
        );

        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const result = await getAllProducts({
            categoryId: req.query.categoryId,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 20
        });

        return res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });

    }
    catch (err) {

        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const product = await getOneProduct(
            req.params.productId
        );

        return res.status(200).json({
            success: true,
            data: product
        });

    }
    catch (err) {

        next(err);
    }
};


const getAllForAdmin = async (req, res, next) => {

    try {

        const result = await getAllProductsForAdmin({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search || "",
            categoryId: req.query.categoryId,
            status: req.query.status || "ALL",
            sort: req.query.sort || "NEWEST"
        });

        return res.status(200).json({
            success: true,
            data: result.products,
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

        const product = await updateProduct(
            req.params.productId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    }
    catch (err) {

        logger.error(
            `Product update failed: ${err.message}`
        );

        next(err);
    }
};


const updateStatus = async (req, res, next) => {

    try {

        const product = await updateProductStatus(
            req.params.productId,
            req.body.isActive
        );

        return res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: product
        });

    }
    catch (err) {

        logger.error(
            `Product status update failed: ${err.message}`
        );

        next(err);
    }
};

const remove = async (req, res, next) => {

    try {

        const result = await deleteProduct(
            req.params.productId
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    }
    catch (err) {

        logger.error(
            `Product deletion failed: ${err.message}`
        );

        next(err);
    }
};


const addImages = async (req, res, next) => {

    try {

        const product = await addProductImages(
            req.params.productId,
            req.files
        );

        return res.status(200).json({
            success: true,
            message: "Product images added successfully",
            data: product
        });

    }
    catch (err) {

        logger.error(
            `Product image upload failed: ${err.message}`
        );

        next(err);
    }
};


const updateImage = async (req, res, next) => {

    try {

        const product = await updateProductImage(
            req.params.productId,
            req.params.imageId,
            req.file
        );

        return res.status(200).json({
            success: true,
            message: "Product image updated successfully",
            data: product
        });

    }
    catch (err) {

        logger.error(
            `Product image update failed: ${err.message}`
        );

        next(err);
    }
};


const removeImage = async (req, res, next) => {

    try {

        const product = await deleteProductImage(
            req.params.productId,
            req.params.imageId
        );

        return res.status(200).json({
            success: true,
            message: "Product image deleted successfully",
            data: product
        });

    }
    catch (err) {

        logger.error(
            `Product image deletion failed: ${err.message}`
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