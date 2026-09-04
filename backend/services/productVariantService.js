const ProductVariant = require("../models/productVariant");
const Product = require("../models/product");


const createProductVariant = async ({
    productId,
    sku,
    price,
    discountPrice,
    attributes,
    images
}) => {

    const product = await Product.findOne({
        _id: productId,
        isActive: true
    });

    if (!product) {
        const error = new Error(
            "Product not found or inactive"
        );
        error.statusCode = 400;
        throw error;
    }

    const existingVariant = await ProductVariant.findOne({
        sku
    });

    if (existingVariant) {
        const error = new Error(
            "A variant with this SKU already exists"
        );
        error.statusCode = 409;
        throw error;
    }

    if (
        discountPrice !== undefined &&
        discountPrice > price
    ) {
        const error = new Error(
            "Discount price cannot be greater than the original price"
        );
        error.statusCode = 400;
        throw error;
    }

    const variant = await ProductVariant.create({
        productId,
        sku,
        price,
        discountPrice,
        attributes,
        images
    });

    return variant;
};


const getAllProductVariants = async (productId) => {

    const product = await Product.findOne({
        _id: productId,
        isActive: true
    });

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    return ProductVariant.find({
        productId,
        isActive: true
    }).sort({
        createdAt: -1
    });
};


const getOneProductVariant = async (variantId) => {

    const variant = await ProductVariant.findOne({
        _id: variantId,
        isActive: true
    }).populate(
        "productId",
        "name slug brand"
    );

    if (!variant) {
        const error = new Error("Product variant not found");
        error.statusCode = 404;
        throw error;
    }

    return variant;
};


const getAllProductVariantsForAdmin = async (productId) => {

    const filter = {};

    if (productId) {
        filter.productId = productId;
    }

    return ProductVariant.find(filter)
        .populate(
            "productId",
            "name slug brand"
        )
        .sort({
            createdAt: -1
        });
};


const updateProductVariant = async (
    variantId,
    {
        sku,
        price,
        discountPrice,
        attributes,
        images
    }
) => {

    const variant = await ProductVariant.findById(
        variantId
    );

    if (!variant) {
        const error = new Error(
            "Product variant not found"
        );
        error.statusCode = 404;
        throw error;
    }

    if (sku !== undefined && sku !== variant.sku) {

        const existingVariant = await ProductVariant.findOne({
            sku,
            _id: { $ne: variantId }
        });

        if (existingVariant) {
            const error = new Error(
                "A variant with this SKU already exists"
            );
            error.statusCode = 409;
            throw error;
        }

        variant.sku = sku;
    }

    const finalPrice =
        price !== undefined
            ? price
            : variant.price;

    const finalDiscountPrice =
        discountPrice !== undefined
            ? discountPrice
            : variant.discountPrice;

    if (finalDiscountPrice > finalPrice) {
        const error = new Error(
            "Discount price cannot be greater than the original price"
        );
        error.statusCode = 400;
        throw error;
    }

    if (price !== undefined) {
        variant.price = price;
    }

    if (discountPrice !== undefined) {
        variant.discountPrice = discountPrice;
    }

    if (attributes !== undefined) {
        variant.attributes = attributes;
    }

    if (images !== undefined) {
        variant.images = images;
    }

    await variant.save();

    return variant;
};


const updateProductVariantStatus = async (
    variantId,
    isActive
) => {

    const variant = await ProductVariant.findById(
        variantId
    );

    if (!variant) {
        const error = new Error(
            "Product variant not found"
        );
        error.statusCode = 404;
        throw error;
    }

    variant.isActive = isActive;

    await variant.save();

    return variant;
};


const deleteProductVariant = async (variantId) => {

    const variant = await ProductVariant.findById(
        variantId
    );

    if (!variant) {
        const error = new Error(
            "Product variant not found"
        );
        error.statusCode = 404;
        throw error;
    }

    await variant.deleteOne();

    return {
        message: "Product variant deleted successfully"
    };
};


const addVariantImages = async (variantId, files) => {

    if (!files || files.length === 0) {
        const error = new Error("At least one image is required");
        error.statusCode = 400;
        throw error;
    }

    const variant = await ProductVariant.findById(variantId);

    if (!variant) {
        const error = new Error("Product variant not found");
        error.statusCode = 404;
        throw error;
    }

    const uploadedImages = [];

    try {

        for (const file of files) {

            const image = await uploadImage(
                file.buffer,
                "poorvika/product-variants"
            );

            uploadedImages.push(image);
        }

        variant.images.push(...uploadedImages);

        await variant.save();

        return variant;

    }
    catch (error) {

        for (const image of uploadedImages) {
            await deleteImage(image.publicId);
        }

        throw error;
    }
};


const updateVariantImage = async (
    variantId,
    imageId,
    file
) => {

    if (!file) {
        const error = new Error("Image is required");
        error.statusCode = 400;
        throw error;
    }

    const variant = await ProductVariant.findById(variantId);

    if (!variant) {
        const error = new Error("Product variant not found");
        error.statusCode = 404;
        throw error;
    }

    const image = variant.images.id(imageId);

    if (!image) {
        const error = new Error("Product variant image not found");
        error.statusCode = 404;
        throw error;
    }

    const oldPublicId = image.publicId;

    const uploadedImage = await uploadImage(
        file.buffer,
        "poorvika/product-variants"
    );

    image.url = uploadedImage.url;
    image.publicId = uploadedImage.publicId;

    try {

        await variant.save();

    }
    catch (error) {

        await deleteImage(uploadedImage.publicId);

        throw error;
    }

    await deleteImage(oldPublicId);

    return variant;
};


const deleteVariantImage = async (
    variantId,
    imageId
) => {

    const variant = await ProductVariant.findById(variantId);

    if (!variant) {
        const error = new Error("Product variant not found");
        error.statusCode = 404;
        throw error;
    }

    const image = variant.images.id(imageId);

    if (!image) {
        const error = new Error("Product variant image not found");
        error.statusCode = 404;
        throw error;
    }

    await deleteImage(image.publicId);

    variant.images.pull(imageId);

    await variant.save();

    return variant;
};



module.exports = {
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
};