const {
    getCart,
    addItem,
    updateItem,
    removeItem,
    toggleItemSelection,
    clearCart
} = require("../services/cartService");

const { logger } = require("../utils/logger");


const get = async (req, res, next) => {

    try {

        const cart = await getCart(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            data: cart
        });

    }
    catch (err) {
        next(err);
    }
};


const add = async (req, res, next) => {

    try {

        const cart = await addItem(
            req.user.userId,
            req.body.productVariantId,
            req.body.quantity
        );

        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: cart
        });

    }
    catch (err) {

        logger.error(
            `Cart item addition failed: ${err.message}`
        );

        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const cart = await updateItem(
            req.user.userId,
            req.params.productVariantId,
            req.body.quantity
        );

        return res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: cart
        });

    }
    catch (err) {

        logger.error(
            `Cart item update failed: ${err.message}`
        );

        next(err);
    }
};


const remove = async (req, res, next) => {

    try {

        const cart = await removeItem(
            req.user.userId,
            req.params.productVariantId
        );

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            data: cart
        });

    }
    catch (err) {

        logger.error(
            `Cart item removal failed: ${err.message}`
        );

        next(err);
    }
};


const select = async (req, res, next) => {

    try {

        const cart = await toggleItemSelection(
            req.user.userId,
            req.params.productVariantId,
            req.body.selected
        );

        return res.status(200).json({
            success: true,
            message: "Cart item selection updated successfully",
            data: cart
        });

    }
    catch (err) {

        logger.error(
            `Cart item selection update failed: ${err.message}`
        );

        next(err);
    }
};


const clear = async (req, res, next) => {

    try {

        const cart = await clearCart(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: cart
        });

    }
    catch (err) {

        logger.error(
            `Cart clearing failed: ${err.message}`
        );

        next(err);
    }
};


module.exports = {
    get,
    add,
    update,
    remove,
    select,
    clear
};