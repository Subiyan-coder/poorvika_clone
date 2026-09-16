const ProductVariant = require("../models/productVariant");
const Product = require("../models/product");
const Inventory = require("../models/inventory");
const {
    uploadImage,
    deleteImage
} = require("./cloudinaryService");


const createProductVariant = async ({
    productId,
    price,
    discountPercentage = 0,
    color,
    primarySpecification,
    secondarySpecification,
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


    // Price validation

    if (
        price === undefined ||
        Number(price) < 0
    ) {

        const error = new Error(
            "Price must be a valid non-negative number"
        );

        error.statusCode = 400;
        throw error;
    }


    // Discount percentage validation

    if (
        Number(discountPercentage) < 0 ||
        Number(discountPercentage) > 100
    ) {

        const error = new Error(
            "Discount percentage must be between 0 and 100"
        );

        error.statusCode = 400;
        throw error;
    }


    // Color validation

    if (
        !color ||
        !String(color).trim()
    ) {

        const error = new Error(
            "Color is required"
        );

        error.statusCode = 400;
        throw error;
    }


    const numericPrice = Number(price);
    const numericDiscountPercentage =
        Number(discountPercentage);

    const discountPrice = Math.floor(
        numericPrice -
        (
            numericPrice *
            numericDiscountPercentage
            / 100
        )
    );


    const sku = [
        product.sku,
        color,
        primarySpecification?.value,
        secondarySpecification?.value
    ]
        .filter(Boolean)
        .map(value =>
            String(value)
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
        )
        .join("-");


    // Check generated SKU

    const existingVariant =
        await ProductVariant.findOne({
            sku
        });

    if (existingVariant) {

        const error = new Error(
            "A variant with the same product and color already exists"
        );

        error.statusCode = 409;
        throw error;
    }


    //  Create product variant.
     

    const variant = await ProductVariant.create({
        productId,
        sku,
        price: numericPrice,
        discountPercentage: numericDiscountPercentage,
        discountPrice,
        color: String(color).trim(),
        primarySpecification,
        secondarySpecification,
        attributes,
        images

    });


    await Inventory.create({
        productId: product._id,
        categoryId: product.categoryId,
        productVariantId: variant._id,
        quantity: 0,
        reservedQuantity: 0,
        isAvailable: true
    });


    await Product.findByIdAndUpdate(
        product._id,
        {
            $inc: {
                activeVariantCount: 1
            }
        }
    );


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

    const variants = await ProductVariant.find({
        productId,
        isActive: true
    })
        .populate(
            "productId",
            "name slug brand specification"
        )
        .sort({
            createdAt: -1
        })
        .lean();

    const variantIds = variants.map(
        variant => variant._id
    );

    const inventories = variantIds.length
        ? await Inventory.find({
            productVariantId: {
                $in: variantIds
            }
        })
            .select(
                "productVariantId quantity isAvailable"
            )
            .lean()
        : [];

    const inventoryMap = new Map(
        inventories.map(inventory => [
            inventory.productVariantId.toString(),
            inventory
        ])
    );

    return variants.map(variant => ({
        ...variant,
        inventory:
            inventoryMap.get(
                variant._id.toString()
            ) || null
    }));
};


const getOneProductVariant = async (variantId) => {

    const variant = await ProductVariant.findOne({
        _id: variantId,
        isActive: true
    })
        .populate(
            "productId",
            "name slug brand specification"
        )
        .lean();

    if (!variant) {
        const error = new Error(
            "Product variant not found"
        );
        error.statusCode = 404;
        throw error;
    }

    const inventory = await Inventory.findOne({
        productVariantId: variantId
    })
        .select(
            "quantity isAvailable"
        )
        .lean();

    return {
        ...variant,
        inventory: inventory || null
    };
};


const getAllProductVariantsForAdmin = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    sort = "newest",
    productId
}) => {

    page = Math.max(
        Number(page) || 1,
        1
    );

    limit = Math.min(
        Math.max(
            Number(limit) || 10,
            1
        ),
        100
    );


    const filter = {};


    // Product filter

    if (productId) {
        filter.productId = productId;
    }


    // Status filter

    if (status === "active") {
        filter.isActive = true;
    }

    if (status === "inactive") {
        filter.isActive = false;
    }


    // Search by SKU

    if (search.trim()) {

        filter.sku = {
            $regex: search.trim(),
            $options: "i"
        };

    }


    // Sort

    let sortOption = {
        createdAt: -1
    };

    switch (sort) {

        case "oldest":

            sortOption = {
                createdAt: 1
            };

            break;

        case "sku_asc":

            sortOption = {
                sku: 1
            };

            break;

        case "sku_desc":

            sortOption = {
                sku: -1
            };

            break;

        case "price_asc":

            sortOption = {
                price: 1
            };

            break;

        case "price_desc":

            sortOption = {
                price: -1
            };

            break;

        case "newest":
        default:

            sortOption = {
                createdAt: -1
            };

            break;

    }


    const skip = (page - 1) * limit;


    const [
        variants,
        total,
        active,
        inactive
    ] = await Promise.all([

        ProductVariant.find(filter)
            .populate(
                "productId",
                "name slug brand sku"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),

        ProductVariant.countDocuments(filter),

        ProductVariant.countDocuments({
            ...filter,
            isActive: true
        }),

        ProductVariant.countDocuments({
            ...filter,
            isActive: false
        })

    ]);


    // Get inventory for the variants on this page

    const variantIds = variants.map(
        variant => variant._id
    );

    const inventories = variantIds.length
        ? await Inventory.find({
            productVariantId: {
                $in: variantIds
            }
        })
            .select(
                "productVariantId quantity reservedQuantity lowStockThreshold isAvailable"
            )
            .lean()
        : [];


    const inventoryMap = new Map(
        inventories.map(inventory => [
            inventory.productVariantId.toString(),
            inventory
        ])
    );


    const variantsWithInventory =
        variants.map(variant => ({

            ...variant,

            inventory:
                inventoryMap.get(
                    variant._id.toString()
                ) || null

        }));


    return {

        variants: variantsWithInventory,

        pagination: {

            page,
            limit,
            total,

            totalPages:
                Math.ceil(total / limit)

        },

        counts: {

            total,
            active,
            inactive

        }

    };

};

const updateProductVariant = async (
    variantId,
    {
        price,
        discountPercentage,
        color,
        primarySpecification,
        secondarySpecification,
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


    const product = await Product.findById(
        variant.productId
    );

    if (!product) {
        const error = new Error(
            "Product associated with variant not found"
        );
        error.statusCode = 404;
        throw error;
    }


    // Final values

    const finalPrice =
        price !== undefined
            ? Number(price)
            : variant.price;

    const finalDiscountPercentage =
        discountPercentage !== undefined
            ? Number(discountPercentage)
            : variant.discountPercentage;

    const finalColor =
        color !== undefined
            ? String(color).trim()
            : variant.color;

    const finalPrimarySpecification =
        primarySpecification !== undefined
            ? primarySpecification
            : variant.primarySpecification;

    const finalSecondarySpecification =
        secondarySpecification !== undefined
            ? secondarySpecification
            : variant.secondarySpecification;

    // Price validation

    if (
        !Number.isFinite(finalPrice) ||
        finalPrice < 0
    ) {
        const error = new Error(
            "Price must be a valid non-negative number"
        );
        error.statusCode = 400;
        throw error;
    }


    // Discount validation

    if (
        !Number.isFinite(finalDiscountPercentage) ||
        finalDiscountPercentage < 0 ||
        finalDiscountPercentage > 100
    ) {
        const error = new Error(
            "Discount percentage must be between 0 and 100"
        );
        error.statusCode = 400;
        throw error;
    }


    // Color validation

    if (!finalColor) {
        const error = new Error(
            "Color is required"
        );
        error.statusCode = 400;
        throw error;
    }

    // Calculate discount price.
     

    const discountPrice =
        finalPrice -
        (
            finalPrice *
            finalDiscountPercentage
            / 100
        );


    const generatedSku = [
        product.sku,
        finalColor,
        finalPrimarySpecification?.value,
        finalSecondarySpecification?.value
    ]
        .filter(Boolean)
        .map(value =>
            String(value)
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
        )
        .join("-");


    if (generatedSku !== variant.sku) {

        const existingVariant =
            await ProductVariant.findOne({
                sku: generatedSku,
                _id: { $ne: variantId }
            });

        if (existingVariant) {
            const error = new Error(
                "A variant with the same product, color and specifications already exists"
            );
            error.statusCode = 409;
            throw error;
        }

        variant.sku = generatedSku;
    }


    // Update fields

    variant.price = finalPrice;

    variant.discountPercentage =
        finalDiscountPercentage;

    variant.discountPrice =
        discountPrice;

    variant.color = finalColor;

    variant.primarySpecification =
        finalPrimarySpecification;

    variant.secondarySpecification =
        finalSecondarySpecification;


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


    // No status change

    if (variant.isActive === isActive) {
        return variant;
    }


    if (isActive === false) {

        const inventory = await Inventory.findOne({
            productVariantId: variantId
        }).select(
            "quantity reservedQuantity"
        );

        if (!inventory) {
            const error = new Error(
                "Inventory record not found for this variant"
            );
            error.statusCode = 404;
            throw error;
        }

        if (
            inventory.quantity > 0 ||
            inventory.reservedQuantity > 0
        ) {
            const error = new Error(
                "Variant cannot be deactivated while stock or reserved stock exists"
            );
            error.statusCode = 409;
            throw error;
        }
    }


    variant.isActive = isActive;

    await variant.save();



    await Product.findByIdAndUpdate(
        variant.productId,
        {
            $inc: isActive
                ? {
                    activeVariantCount: 1,
                    inactiveVariantCount: -1
                }
                : {
                    activeVariantCount: -1,
                    inactiveVariantCount: 1
                }
        }
    );


    return variant;
};


const deleteProductVariant = async (variantId) => {

    const variant =
        await ProductVariant.findById(
            variantId
        );

    if (!variant) {

        const error = new Error(
            "Product variant not found"
        );

        error.statusCode = 404;

        throw error;
    }


    const inventory =
        await Inventory.findOne({
            productVariantId: variantId
        });


    if (
        inventory &&
        (
            inventory.quantity > 0 ||
            inventory.reservedQuantity > 0
        )
    ) {

        const error = new Error(
            "Cannot delete variant while stock is available or reserved"
        );

        error.statusCode = 409;

        throw error;
    }


    if (inventory) {
        await inventory.deleteOne();
    }


    await variant.deleteOne();



    await Product.findByIdAndUpdate(
        variant.productId,
        {
            $inc: variant.isActive
                ? {
                    activeVariantCount: -1
                }
                : {
                    inactiveVariantCount: -1
                }
        }
    );


    return {
        message:
            "Product variant deleted successfully"
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