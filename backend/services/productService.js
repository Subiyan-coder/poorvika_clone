const Product = require("../models/product");
const Category = require("../models/category");
const ProductVariant = require("../models/productVariant");
const Inventory = require("../models/inventory");
const { uploadImage, deleteImage } = require("./cloudinaryService");
const {
    getAllProductVariants
} = require("./productVariantService");

const createProduct = async (
    {
        categoryId,
        name,
        description,
        brand,
        specification
    }
) => {

    const category = await Category.findOne({
        _id : categoryId,
        isActive : true
    });

    if (!category) {

        const error = new Error(
            "Category not found or inactive"
        );

        error.statusCode = 400;
        throw error;
    }

    const slug = String(name)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    

    const existingProduct = await Product.findOne({
        $or : [
            { name },
            { slug }
        ]
    });

    if (existingProduct) {

        const error = new Error(
            "A product with this name or slug already exists"
        );

        error.statusCode = 409;
        throw error;
    }


    const skuParts = [
        category.sku,
        brand,
        name
    ];


    const sku = skuParts
        .filter(value => value)
        .map(value =>
            String(value)
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
        )
        .join("-");


    const existingSku = await Product.findOne({
        sku
    });

    if (existingSku) {

        const error = new Error(
            "A product with this SKU already exists"
        );

        error.statusCode = 409;
        throw error;
    }


    const product = await Product.create({
        categoryId,
        name,
        slug,
        sku,
        description,
        brand,
        specification
    });


    await Category.findByIdAndUpdate(
        categoryId,
        {
            $inc : {
                activeProductCount : 1
            }
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


const getOneProduct = async (productId) => {

    const product = await Product.findOne({
        _id: productId,
        isActive: true
    })
        .populate(
            "categoryId",
            "name slug"
        )
        .lean();

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    const variants =
        await getAllProductVariants(productId);

    return {
        ...product,
        variants
    };
};



const getAllProductsForAdmin = async ({
    page = 1,
    limit = 10,
    search = "",
    categoryId,
    status = "ALL",
    sort = "NEWEST"
} = {}) => {

    const skip = (page - 1) * limit;

    const filter = {};

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
            },
            {
                sku: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                brand: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    if (categoryId) {
        filter.categoryId = categoryId;
    }

    if (status === "ACTIVE") {
        filter.isActive = true;
    }

    if (status === "INACTIVE") {
        filter.isActive = false;
    }

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

        default:
            sortOption = { createdAt: -1 };
    }

    const [
        products,
        totalItems,
        totalProducts,
        activeProducts,
        inactiveProducts
    ] = await Promise.all([

        Product.find(filter)
            .populate("categoryId", "name slug")
            .sort(sortOption)
            .skip(skip)
            .limit(limit),

        Product.countDocuments(filter),

        Product.countDocuments(),

        Product.countDocuments({
            isActive: true
        }),

        Product.countDocuments({
            isActive: false
        })
    ]);

    return {

        products,

        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(
                totalItems / limit
            )
        },

        counts: {
            total: totalProducts,
            active: activeProducts,
            inactive: inactiveProducts
        }
    };
};


const updateProduct = async (
    productId,
    {
        categoryId,
        name,
        description,
        brand,
        specification
    }
) => {

    const product = await Product.findById(productId);

    if (!product) {

        const error = new Error(
            "Product not found"
        );

        error.statusCode = 404;
        throw error;
    }


    const oldCategoryId =
        product.categoryId.toString();

    let category = await Category.findById(
        product.categoryId
    );

    if (!category) {

        const error = new Error(
            "Product category not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // Category

    if (
        categoryId !== undefined &&
        categoryId.toString() !== oldCategoryId
    ) {

        const newCategory =
            await Category.findOne({
                _id: categoryId,
                isActive: true
            });

        if (!newCategory) {

            const error = new Error(
                "Category not found or inactive"
            );

            error.statusCode = 400;
            throw error;
        }

        category = newCategory;

        product.categoryId = categoryId;
    }


    // Name

    if (
        name !== undefined &&
        name !== product.name
    ) {

        const existingProduct =
            await Product.findOne({
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

        product.slug = String(product.name)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        

        const existingSlug = await Product.findOne({
            slug: product.slug,
            _id: { $ne: productId }
        });

        if (existingSlug) {

            const error = new Error(
                "A product with this slug already exists"
            );

            error.statusCode = 409;
            throw error;
        }

    }


    // Description

    if (description !== undefined) {
        product.description = description;
    }


    // Brand

    if (brand !== undefined) {
        product.brand = brand;
    }



    // Full specifications

    if (specification !== undefined) {
        product.specification =
            specification;
    }

    // Generate Product SKU.


    const skuParts = [
        category.sku,
        product.brand,
        product.name
    ];


    const newSku = skuParts
        .filter(value => value)
        .map(value =>
            String(value)
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
        )
        .join("-");


    const skuChanged =
        newSku !== product.sku;


    if (skuChanged) {

        const existingSku =
            await Product.findOne({
                sku: newSku,
                _id: { $ne: productId }
            });

        if (existingSku) {

            const error = new Error(
                "A product with this SKU already exists"
            );

            error.statusCode = 409;
            throw error;
        }

        product.sku = newSku;
    }

    await product.save();


    const categoryChanged =
        categoryId !== undefined &&
        categoryId.toString() !== oldCategoryId;


    if (categoryChanged) {

        const counterField =
            product.isActive
                ? "activeProductCount"
                : "inactiveProductCount";


        await Category.findByIdAndUpdate(
            oldCategoryId,
            {
                $inc: {
                    [counterField]: -1
                }
            }
        );

        await Category.findByIdAndUpdate(
            categoryId,
            {
                $inc: {
                    [counterField]: 1
                }
            }
        );
    }

    return product;
};


const updateProductStatus = async (
    productId,
    isActive
) => {

    const product = await Product.findById(productId);

    if (!product) {

        const error = new Error(
            "Product not found"
        );

        error.statusCode = 404;
        throw error;
    }


    if (product.isActive === isActive) {
        return product;
    }


    if (!isActive) {

        const inventoryExists =
            await Inventory.exists({

                productId,

                $or: [
                    {
                        quantity: {
                            $gt: 0
                        }
                    },
                    {
                        reservedQuantity: {
                            $gt: 0
                        }
                    }
                ]

            });


        if (inventoryExists) {

            const error = new Error(
                "Product cannot be deactivated because one or more variants still have stock or reserved stock"
            );

            error.statusCode = 409;
            throw error;
        }
    }


    product.isActive = isActive;

    await product.save();


    if (isActive) {

        await Category.findByIdAndUpdate(
            product.categoryId,
            {
                $inc: {
                    activeProductCount: 1,
                    inactiveProductCount: -1
                }
            }
        );

    }
    else {

        await Category.findByIdAndUpdate(
            product.categoryId,
            {
                $inc: {
                    activeProductCount: -1,
                    inactiveProductCount: 1
                }
            }
        );
    }


    return product;
};


const deleteProduct = async (productId) => {

    const product = await Product.findById(productId);

    if (!product) {

        const error = new Error(
            "Product not found"
        );

        error.statusCode = 404;
        throw error;
    }

    const inventoryExists = await Inventory.exists({

        productId,

        $or: [
            {
                quantity: {
                    $gt: 0
                }
            },
            {
                reservedQuantity: {
                    $gt: 0
                }
            }
        ]

    });


    if (inventoryExists) {

        const error = new Error(
            "Product cannot be deleted because one or more variants still have stock or reserved stock"
        );

        error.statusCode = 409;
        throw error;
    }



    const variants =
        await ProductVariant.find({
            productId
        }).select("_id images");



    const variantPublicIds = variants
        .flatMap(variant => variant.images || [])
        .map(image => image.publicId)
        .filter(Boolean);



    await Inventory.deleteMany({
        productId
    });



    await ProductVariant.deleteMany({
        productId
    });


    const productPublicIds = product.images
        .map(image => image.publicId)
        .filter(Boolean);


    await product.deleteOne();


    const counterField =
        product.isActive
            ? "activeProductCount"
            : "inactiveProductCount";


    await Category.findByIdAndUpdate(
        product.categoryId,
        {
            $inc: {
                [counterField]: -1
            }
        }
    );


    await Promise.all([

        ...productPublicIds.map(
            publicId => deleteImage(publicId)
        ),

        ...variantPublicIds.map(
            publicId => deleteImage(publicId)
        )

    ]);


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


const getProductsForSelector = async ({
    categoryId,
    search = "",
    limit = 10
} = {}) => {

    if (!categoryId) {
        const error = new Error(
            "Category is required"
        );

        error.statusCode = 400;
        throw error;
    }

    const filter = {
        categoryId,
        isActive: true
    };

    if (search.trim()) {

        const searchTerm = search
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        filter.$or = [
            {
                name: {
                    $regex: `^${searchTerm}`,
                    $options: "i"
                }
            },
            {
                brand: {
                    $regex: `^${searchTerm}`,
                    $options: "i"
                }
            }
        ];
    }

    return Product.find(filter)
        .select("_id name brand images")
        .sort({ name: 1 })
        .limit(Number(limit))
        .lean();
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
    updateProductImage,
    getProductsForSelector
};