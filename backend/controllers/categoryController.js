const {
    createCategory,
    getAllCategories,
    getOneCategory,
    updateCategory,
    updateCategoryStatus,
    getAllCategoriesForAdmin,
    deleteCategory
} = require("../services/categoryService");

const { logger } = require("../utils/logger");


const create = async (req, res, next) => {

    try {

        const category = await createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    }
    catch (err) {

        logger.error(
            `Category creation failed: ${err.message}`
        );

        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const categories = await getAllCategories();

        return res.status(200).json({
            success: true,
            data: categories
        });

    }
    catch (err) {

        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const category = await getOneCategory(
            req.params.categoryId
        );

        return res.status(200).json({
            success: true,
            data: category
        });

    }
    catch (err) {

        next(err);
    }
};


const getAllForAdmin = async (req, res, next) => {

    try {

        const categories = await getAllCategoriesForAdmin();

        return res.status(200).json({
            success: true,
            data: categories
        });

    }
    catch (err) {

        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const category = await updateCategory(
            req.params.categoryId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    }
    catch (err) {

        logger.error(
            `Category update failed: ${err.message}`
        );

        next(err);
    }
};


const updateStatus = async (req, res, next) => {

    try {

        const category = await updateCategoryStatus(
            req.params.categoryId,
            req.body.isActive
        );

        return res.status(200).json({
            success: true,
            message: "Category status updated successfully",
            data: category
        });

    }
    catch (err) {

        logger.error(
            `Category status update failed: ${err.message}`
        );

        next(err);
    }
};

const remove = async (req, res, next) => {

    try {

        const result = await deleteCategory(
            req.params.categoryId
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    }
    catch (err) {

        logger.error(
            `Category deletion failed: ${err.message}`
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