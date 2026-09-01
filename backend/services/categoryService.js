const Category = require("../models/category");
const Product = require("../models/product");

const createCategory = async ( { name, slug, description, images } ) => {

    const existingCategory = await Category.findOne(
        {
            $or : [
                { name },
                { slug }
            ]
        }
    );

    if(existingCategory){
        const error = new Error("A category with this name or slug is already exists");
        error.statusCode = 409;
        throw error;
    }

    const category = await Category.ceate(
        {
            name,
            slug,
            description,
            images
        }
    );

    return category
};


const getAllCategories = async() => {

    const allCategories = await Category.find(
        { isActive : true }
    ).sort(
        { name : 1 }
    );

    return allCategories;
};


const getOneCategory = async( categoryId ) => {

    const category = await Category.findOne(
        {
            _id : categoryId,
            isActive : true
        }
    );

    if(!category){
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
    }

    return category;
};


const updateCategory = async (
    categoryId,
    {
        name,
        slug,
        description,
        images
    }
) => {

    const category = Category.findById(categoryId);

    if(!category){
        const error = new Error("category not found");
        error.statusCode = 404;
        throw error;
    }

    if(name !== undefined && name !== category.name){
        const existingCategory = await Category.findOne(
            {
                name,
                _id: { $ne: categoryId }
            }
        );

        if (existingCategory) {
            const error = new Error("A category with this name already exists");
            error.statusCode = 409;
            throw error;
        }

        category.name = name;
    };

    if (slug !== undefined && slug !== category.slug) {

        const existingCategory = await Category.findOne(
            {
                slug,
                _id: { $ne: categoryId }
            }
        );

        if (existingCategory) {
            const error = new Error("A category with this slug already exists");
            error.statusCode = 409;
            throw error;
        }

        category.slug = slug;
    }

    if (description !== undefined) {
        category.description = description;
    }

    if (images !== undefined) {
        category.images = images;
    }

    await category.save();

    return category;

};


const updateCategoryStatus = async (
    categoryId,
    isActive
) => {

    const category = await Category.findById(categoryId);

    if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
    }

    category.isActive = isActive;

    await category.save();

    return category;
};

const getAllCategoriesForAdmin = async () => {

    return Category.find().sort({
        createdAt: -1
    });
};

const deleteCategory = async (categoryId) => {

    const category = await Category.findById(categoryId);

    if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
    }

    const productExists = await Product.exists({
        categoryId
    });

    if (productExists) {
        const error = new Error( "Category cannot be deleted because products are associated with it" );
        error.statusCode = 409;
        throw error;
    }

    await category.deleteOne();

    return {
        message: "Category deleted successfully"
    };
};

module.exports = {
    createCategory,
    getAllCategories,
    getOneCategory,
    updateCategory,
    updateCategoryStatus,
    getAllCategoriesForAdmin,
    deleteCategory
};