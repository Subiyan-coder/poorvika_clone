const Cart = require("../models/cart");
const ProductVariant = require("../models/productVariant");
const Inventory = require("../models/inventory");


const getCart = async (userId) => {

    const cart = await Cart.findOne({
        userId
    }).populate({
        path: "items.productVariant",
        select: "productId sku price discountPrice attributes images isActive",
        populate: {
            path: "productId",
            select: "name"
        }
    });

    if (!cart) {
        return {
            userId,
            items: []
        };
    }

    return cart;
};


const addItem = async (
    userId,
    productVariantId,
    quantity
) => {

    const variant = await ProductVariant.findOne({
        _id: productVariantId,
        isActive: true
    });

    if (!variant) {
        const error = new Error(
            "Product variant not found or inactive"
        );
        error.statusCode = 404;
        throw error;
    }

    const inventory = await Inventory.findOne({
        productVariantId,
        isAvailable: true
    });

    if (!inventory) {
        const error = new Error(
            "Product variant is currently unavailable"
        );
        error.statusCode = 400;
        throw error;
    }

    const availableQuantity =
        inventory.quantity -
        inventory.reservedQuantity;

    if (quantity > availableQuantity) {
        const error = new Error(
            "Requested quantity exceeds available stock"
        );
        error.statusCode = 400;
        throw error;
    }

    let cart = await Cart.findOne({
        userId
    });

    if (!cart) {

        cart = await Cart.create({
            userId,
            items: [
                {
                    productVariant: productVariantId,
                    quantity,
                    selected: true
                }
            ]
        });

        return cart;
    }

    const existingItem = cart.items.find(
        item =>
            item.productVariant.toString() ===
            productVariantId.toString()
    );

    if (existingItem) {

        const newQuantity =
            existingItem.quantity + quantity;

        if (newQuantity > availableQuantity) {
            const error = new Error(
                "Total quantity exceeds available stock"
            );
            error.statusCode = 400;
            throw error;
        }

        existingItem.quantity = newQuantity;

    }
    else {

        cart.items.push({
            productVariant: productVariantId,
            quantity,
            selected: true
        });

    }

    await cart.save();

    return cart;
};


const updateItem = async (
    userId,
    productVariantId,
    quantity
) => {

    const cart = await Cart.findOne({
        userId
    });

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    const item = cart.items.find(
        item =>
            item.productVariant.toString() ===
            productVariantId.toString()
    );

    if (!item) {
        const error = new Error(
            "Product variant is not in the cart"
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
            "Product variant not found or inactive"
        );
        error.statusCode = 404;
        throw error;
    }

    const inventory = await Inventory.findOne({
        productVariantId,
        isAvailable: true
    });

    if (!inventory) {
        const error = new Error(
            "Product variant is currently unavailable"
        );
        error.statusCode = 400;
        throw error;
    }

    const availableQuantity =
        inventory.quantity -
        inventory.reservedQuantity;

    if (quantity > availableQuantity) {
        const error = new Error(
            "Requested quantity exceeds available stock"
        );
        error.statusCode = 400;
        throw error;
    }

    item.quantity = quantity;

    await cart.save();

    return cart;
};


const removeItem = async (
    userId,
    productVariantId
) => {

    const cart = await Cart.findOne({
        userId
    });

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    const itemExists = cart.items.some(
        item =>
            item.productVariant.toString() ===
            productVariantId.toString()
    );

    if (!itemExists) {
        const error = new Error(
            "Product variant is not in the cart"
        );
        error.statusCode = 404;
        throw error;
    }

    cart.items.pull({
        productVariant: productVariantId
    });

    await cart.save();

    return cart;
};


const toggleItemSelection = async (
    userId,
    productVariantId,
    selected
) => {

    const cart = await Cart.findOne({
        userId
    });

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    const item = cart.items.find(
        item =>
            item.productVariant.toString() ===
            productVariantId.toString()
    );

    if (!item) {
        const error = new Error(
            "Product variant is not in the cart"
        );
        error.statusCode = 404;
        throw error;
    }

    item.selected = selected;

    await cart.save();

    return cart;
};


const clearCart = async (userId) => {

    const cart = await Cart.findOne({
        userId
    });

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    cart.items = [];

    await cart.save();

    return cart;
};


module.exports = {
    getCart,
    addItem,
    updateItem,
    removeItem,
    toggleItemSelection,
    clearCart
};