const Inventory = require("../models/inventory");
const InventoryTransaction = require("../models/inventoryTransaction");
const ProductVariant = require("../models/productVariant");


const createInventory = async ({
    productVariantId,
    quantity,
    lowStockThreshold
}) => {

    const variant = await ProductVariant.findById(
        productVariantId
    );

    if (!variant) {
        const error = new Error("Product variant not found");
        error.statusCode = 404;
        throw error;
    }

    const existingInventory = await Inventory.findOne({
        productVariantId
    });

    if (existingInventory) {
        const error = new Error(
            "Inventory already exists for this product variant"
        );
        error.statusCode = 409;
        throw error;
    }

    const inventory = await Inventory.create({
        productVariantId,
        quantity,
        lowStockThreshold
    });

    if (quantity > 0) {
        await InventoryTransaction.create({
            productVariantId,
            type: "ADD",
            quantity,
            note: "Initial inventory"
        });
    }

    return inventory;
};


const getInventory = async (productVariantId) => {

    const inventory = await Inventory.findOne({
        productVariantId
    }).populate(
        "productVariantId",
        "sku price discountPrice attributes"
    );

    if (!inventory) {
        const error = new Error("Inventory not found");
        error.statusCode = 404;
        throw error;
    }

    return inventory;
};


const getAllInventory = async () => {

    return Inventory.find()
        .populate(
            "productVariantId",
            "sku price discountPrice attributes"
        )
        .sort({
            updatedAt: -1
        });
};


const adjustInventory = async ({
    productVariantId,
    quantity,
    type,
    note
}) => {

    const inventory = await Inventory.findOne({
        productVariantId
    });

    if (!inventory) {
        const error = new Error("Inventory not found");
        error.statusCode = 404;
        throw error;
    }

    if (!["ADD", "REMOVE", "DAMAGE"].includes(type)) {
        const error = new Error(
            "Invalid inventory adjustment type"
        );
        error.statusCode = 400;
        throw error;
    }

    if (type === "DAMAGE") {

        const availableQuantity =
            inventory.quantity -
            inventory.reservedQuantity;

        if (quantity > availableQuantity) {
            const error = new Error(
                "Damage quantity cannot exceed available stock"
            );
            error.statusCode = 400;
            throw error;
        }

        inventory.quantity -= quantity;
    }

    if (type === "ADD") {
        inventory.quantity += quantity;
    }

    if (type === "REMOVE") {

        const availableQuantity =
            inventory.quantity -
            inventory.reservedQuantity;

        if (quantity > availableQuantity) {
            const error = new Error(
                "Quantity to remove cannot exceed available stock"
            );
            error.statusCode = 400;
            throw error;
        }

        inventory.quantity -= quantity;
    }

    await inventory.save();

    await InventoryTransaction.create({
        productVariantId,
        type,
        quantity,
        note
    });

    return inventory;
};


const updateAvailability = async (
    productVariantId,
    isAvailable
) => {

    const inventory = await Inventory.findOne({
        productVariantId
    });

    if (!inventory) {
        const error = new Error("Inventory not found");
        error.statusCode = 404;
        throw error;
    }

    inventory.isAvailable = isAvailable;

    await inventory.save();

    return inventory;
};


module.exports = {
    createInventory,
    getInventory,
    getAllInventory,
    adjustInventory,
    updateAvailability
};