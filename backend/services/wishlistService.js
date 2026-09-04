const Wishlist = require("../models/wishlist");
const ProductVariant = require("../models/productVariant");


const createWishlist = async (
    userId,
    name
) => {

    const wishlist = await Wishlist.create({
        userId,
        name: name || "Favourites"
    });

    return wishlist;
};


const getMyWishlists = async (userId) => {

    return Wishlist.find({
        userId
    })
        .populate(
            "variants",
            "sku attributes price discountPrice productId"
        )
        .sort({
            createdAt: -1
        });
};


const getWishlist = async (
    userId,
    wishlistId
) => {

    const wishlist = await Wishlist.findOne({
        _id: wishlistId,
        userId
    })
        .populate(
            "variants",
            "sku attributes price discountPrice productId"
        );

    if (!wishlist) {
        const error = new Error(
            "Wishlist not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return wishlist;
};


const renameWishlist = async (
    userId,
    wishlistId,
    name
) => {

    const wishlist = await Wishlist.findOne({
        _id: wishlistId,
        userId
    });

    if (!wishlist) {
        const error = new Error(
            "Wishlist not found"
        );
        error.statusCode = 404;
        throw error;
    }


    wishlist.name = name;

    await wishlist.save();


    return wishlist;
};


const deleteWishlist = async (
    userId,
    wishlistId
) => {

    const wishlist = await Wishlist.findOne({
        _id: wishlistId,
        userId
    });

    if (!wishlist) {
        const error = new Error(
            "Wishlist not found"
        );
        error.statusCode = 404;
        throw error;
    }


    await wishlist.deleteOne();


    return wishlist;
};


const addToWishlist = async (
    userId,
    wishlistId,
    productVariantId
) => {

    const wishlist = await Wishlist.findOne({
        _id: wishlistId,
        userId
    });

    if (!wishlist) {
        const error = new Error(
            "Wishlist not found"
        );
        error.statusCode = 404;
        throw error;
    }


    const variant = await ProductVariant.findOne({
        _id: productVariantId,
        isActive: true
    });

    if (!variant) {
        const error = new Error(
            "Product variant not found or unavailable"
        );
        error.statusCode = 404;
        throw error;
    }


    const alreadyExists =
        wishlist.variants.some(
            variantId =>
                variantId.toString() ===
                productVariantId.toString()
        );

    if (alreadyExists) {
        const error = new Error(
            "Product is already in the wishlist"
        );
        error.statusCode = 409;
        throw error;
    }


    wishlist.variants.push(
        productVariantId
    );

    await wishlist.save();


    return wishlist;
};


const removeFromWishlist = async (
    userId,
    wishlistId,
    productVariantId
) => {

    const wishlist = await Wishlist.findOne({
        _id: wishlistId,
        userId
    });

    if (!wishlist) {
        const error = new Error(
            "Wishlist not found"
        );
        error.statusCode = 404;
        throw error;
    }


    const variantIndex =
        wishlist.variants.findIndex(
            variantId =>
                variantId.toString() ===
                productVariantId.toString()
        );

    if (variantIndex === -1) {
        const error = new Error(
            "Product is not in the wishlist"
        );
        error.statusCode = 404;
        throw error;
    }


    wishlist.variants.splice(
        variantIndex,
        1
    );

    await wishlist.save();


    return wishlist;
};


module.exports = {
    createWishlist,
    getMyWishlists,
    getWishlist,
    renameWishlist,
    deleteWishlist,
    addToWishlist,
    removeFromWishlist
};