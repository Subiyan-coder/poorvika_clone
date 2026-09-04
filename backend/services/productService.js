const Product = require("../models/product");
const Category = require("../models/category");
const ProductVariant = require("../models/productVariant");
const { uploadImage, deleteImage } = require("./cloudinaryService");

const createProduct = async (
    {
        categoryId,
        name,
        slug,
        description,
        brand,
        specification
    }
) => {

    const category = await Category.findOne(
        {
            _id : categoryId,
            isActive : true
        }
    );

    if(!category){
        const error = new Error("Category of this product is not found");
        error.statusCode = 400;
        throw error;
    }

    const existingProduct = await Product.findOne(
        {
            $or : [
                { name },
                { slug }
            ]
        }
    );

    if(existingProduct) {
        const error = new Error("A product with this name is already exists");
        error.statusCode = 409;
        throw error;
    }

    const product = await Product.create(
        {
            categoryId,
            name,
            slug,
            description,
            brand,
            specification
        }
    );

    return product;
};


const getAllProducts = async (
    {
        categoryId,
        page = 1,
        limit = 20
    } = {}
) => {

    const filter = {
        isActive : true,
    };

    if(categoryId) {
        filter.categoryId = categoryId;
    }

    const skip = (page - 1) * limit;

    const [ products, total ] = await Promise.all(
        [
            Product.find(filter)
                .populate("categoryId", "name slug")
                .sort({ createdAt : -1 })
                .skip(skip)
                .limit(limit),

                Product.countDocuments(filter)
        ]
    );

    return {
        products,
        pagination : {
            page,
            limit,
            total,
            totalPages : Math.ceil( total / limit )
        }
    };
};


const getOneProduct = async( productId ) => {

    const product = await Product.findOne(
        {
            _id : productId,
            isActive : true
        }
    ).populate(
        "categoryId",
        "name slug"
    );

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    return product;

};


const getAllProductsForAdmin = async () => {

    return Product.find()
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 });
};


const updateProduct = async (
    productId,
    {
        categoryId,
        name,
        slug,
        description,
        brand,
        specification
    }
) => {

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    if (categoryId !== undefined) {

        const category = await Category.findOne({
            _id: categoryId,
            isActive: true
        });

        if (!category) {
            const error = new Error(
                "Category not found or inactive"
            );
            error.statusCode = 400;
            throw error;
        }

        product.categoryId = categoryId;
    }

    if (name !== undefined && name !== product.name) {

        const existingProduct = await Product.findOne({
            name,
            _id: { $ne: productId }
        });

        if (existingProduct) {
            const error = new Error(
                "A product with this name already exists"
            );
            error.statusCode = 409;
            throw error;
        }

        product.name = name;
    }

    if (slug !== undefined && slug !== product.slug) {

        const existingProduct = await Product.findOne({
            slug,
            _id: { $ne: productId }
        });

        if (existingProduct) {
            const error = new Error(
                "A product with this slug already exists"
            );
            error.statusCode = 409;
            throw error;
        }

        product.slug = slug;
    }

    if (description !== undefined) {
        product.description = description;
    }

    if (brand !== undefined) {
        product.brand = brand;
    }

    if (specification !== undefined) {
        product.specification = specification;
    }

    await product.save();

    return product;
};


const updateProductStatus = async (
    productId,
    isActive
) => {

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    product.isActive = isActive;

    await product.save();

    return product;
};


const deleteProduct = async (productId) => {

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    const variantExists = await ProductVariant.exists({
        productId
    });

    if (variantExists) {
        const error = new Error(
            "Product cannot be deleted because variants are associated with it"
        );
        error.statusCode = 409;
        throw error;
    }

    await product.deleteOne();

    return {
        message: "Product deleted successfully"
    };
};


const addProductImages = async (productId, files) => {

    if (!files || files.length === 0) {
        const error = new Error("At least one image is required");
        error.statusCode = 400;
        throw error;
    }

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    const uploadedImages = [];

    try {

        for (const file of files) {

            const image = await uploadImage(
                file.buffer,
                "poorvika/products"
            );

            uploadedImages.push(image);
        }

        product.images.push(...uploadedImages);

        await product.save();

        return product;

    } catch (error) {

        for (const image of uploadedImages) {
            await deleteImage(image.publicId);
        }

        throw error;
    }
};


const deleteProductImage = async (productId, imageId) => {

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    const image = product.images.id(imageId);

    if (!image) {
        const error = new Error("Product image not found");
        error.statusCode = 404;
        throw error;
    }

    await deleteImage(image.publicId);

    product.images.pull(imageId);

    await product.save();

    return product;
};


const updateProductImage = async (
    productId,
    imageId,
    file
) => {

    if (!file) {
        const error = new Error("Image is required");
        error.statusCode = 400;
        throw error;
    }

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    const image = product.images.id(imageId);

    if (!image) {
        const error = new Error("Product image not found");
        error.statusCode = 404;
        throw error;
    }

    const oldPublicId = image.publicId;

    const uploadedImage = await uploadImage(
        file.buffer,
        "poorvika/products"
    );

    image.url = uploadedImage.url;
    image.publicId = uploadedImage.publicId;

    try {

        await product.save();

    } catch (error) {

        await deleteImage(uploadedImage.publicId);

        throw error;
    }

    await deleteImage(oldPublicId);

    return product;
};

module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    getAllProductsForAdmin,
    updateProduct,
    updateProductStatus,
    deleteProduct,
    addProductImages,
    deleteProductImage,
    updateProductImage
};