const Category = require("../models/category");
const Product = require("../models/product");
const Inventory = require("../models/inventory");
const { uploadImage, deleteImage } = require("./cloudinaryService"); 

const createCategory = async ( { heading, name, file } ) => {

    const slug = name;

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

    if (!file) {
        const error = new Error("Category image is required");
        error.statusCode = 400;
        throw error;
    }


    const uploadedImage = await uploadImage(
        file.buffer,
        "poorvika/categories"
    );

    const category = await Category.create(
        {
            heading,
            name,
            slug,
            sku : slug,
            images : {
                url : uploadedImage.url,
                publicId : uploadedImage.publicId
            }
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
        heading,
        name,
        file
    }
) => {

    const category = await Category.findById(categoryId);

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

        const newSlug = String(name)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const existingSlug = await Category.findOne({
            slug: newSlug,
            _id: { $ne: categoryId }
        });

        if (existingSlug) {
            const error = new Error(
                "A category with this slug already exists"
            );

            error.statusCode = 409;
            throw error;
        }

        category.name = name;
        category.slug = newSlug;
        category.sku = newSlug.toUpperCase();
    };

    if (heading !== undefined) {
        category.heading = heading;
    }

    if (file) {

    const oldPublicId = category.images?.publicId;

    const uploadedImage = await uploadImage(
        file.buffer,
        "poorvika/categories"
    );

    category.images = {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId
    };

    if (oldPublicId) {
            await deleteImage(oldPublicId);
        }
    }

    await category.save();

    return category;

};

const hasCategoryStock = async (categoryId) => {

    const inventoryExists = await Inventory.exists({
        categoryId,
        $or : [
            {
                quantity : {
                    $gt : 0
                }
            },
            {
                reservedQuantity : {
                    $gt : 0
                }
            }
        ]
    });

    return Boolean(inventoryExists);
};


const updateCategoryStatus = async (
    categoryId,
    isActive
) => {

    const category = await Category.findById(
        categoryId
    );

    if (!category) {

        const error = new Error(
            "Category not found"
        );

        error.statusCode = 404;
        throw error;
    }


    if (category.isActive === isActive) {
        return category;
    }


    if (!isActive) {

        const hasStock =
            await hasCategoryStock(
                categoryId
            );

        if (hasStock) {

            const error = new Error(
                "Category cannot be deactivated because inventory stock exists"
            );

            error.statusCode = 409;
            throw error;
        }
    }


    category.isActive = isActive;

    await category.save();

    return category;
};


const getAllCategoriesForAdmin = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "ALL",
    sort = "NEWEST"
}) => {

    const skip = (page - 1) * limit;

    const filter = {};

    // Search
    if (search) {

        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                slug: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    // Status filter
    if (status === "ACTIVE") {
        filter.isActive = true;
    }

    if (status === "INACTIVE") {
        filter.isActive = false;
    }

    // Sort
    let sortOption;

    switch (sort) {

        case "OLDEST":
            sortOption = { createdAt: 1 };
            break;

        case "NAME_ASC":
            sortOption = { name: 1 };
            break;

        case "NAME_DESC":
            sortOption = { name: -1 };
            break;

        case "NEWEST":
        default:
            sortOption = { createdAt: -1 };
            break;
    }

    const [
        categories,
        totalItems,
        totalCategories,
        activeCategories,
        inactiveCategories
    ] = await Promise.all([

        Category.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit),

        Category.countDocuments(filter),

        Category.countDocuments(),

        Category.countDocuments({
            isActive: true
        }),

        Category.countDocuments({
            isActive: false
        })
    ]);

    return {

        categories,

        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(
                totalItems / limit
            )
        },

        counts: {
            total: totalCategories,
            active: activeCategories,
            inactive: inactiveCategories
        }
    };
};


const deleteCategory = async (categoryId) => {

    const category = await Category.findById(
        categoryId
    );

    if (!category) {

        const error = new Error(
            "Category not found"
        );

        error.statusCode = 404;
        throw error;
    }


    const hasStock =
        await hasCategoryStock(
            categoryId
        );

    if (hasStock) {

        const error = new Error(
            "Category cannot be deleted because inventory stock exists"
        );

        error.statusCode = 409;
        throw error;
    }


    const productExists = await Product.exists({
        categoryId
    });

    if (productExists) {

        const error = new Error(
            "Category cannot be deleted because products are associated with it"
        );

        error.statusCode = 409;
        throw error;
    }


    const publicId =
        category.images?.publicId;

    await category.deleteOne();

    if (publicId) {
        await deleteImage(publicId);
    }


    return {
        message : "Category deleted successfully"
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