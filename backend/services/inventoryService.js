const Inventory = require("../models/inventory");
const InventoryTransaction = require("../models/inventoryTransaction");


const getInventory = async (productVariantId) => {

    const inventory = await Inventory.findOne({
        productVariantId
    }).populate({
            path: "productVariantId",
            select:
                "sku price discountPrice color attributes productId",
            populate: {
                path: "productId",
                select:
                    "name slug sku brand categoryId primarySpecification secondarySpecification",
                populate: {
                    path: "categoryId",
                    select: "name slug"
                }
            }
        });
    

    if (!inventory) {
        const error = new Error("Inventory not found");
        error.statusCode = 404;
        throw error;
    }

    return inventory;
};


const getAllInventory = async () => {

    return Inventory.find()
        .populate({
            path: "productVariantId",
            select:
                "sku price discountPrice color attributes productId",
            populate: {
                path: "productId",
                select:
                    "name slug sku brand categoryId primarySpecification secondarySpecification",
                populate: {
                    path: "categoryId",
                    select: "name slug"
                }
            }
        })
        .sort({
            updatedAt: -1
        });
};


const adjustInventory = async ({
    productVariantId,
    quantity,
    type,
    note,
    performedBy
}) => {

    const inventory = await Inventory.findOne({
        productVariantId
    });

    if (!inventory) {
        const error = new Error(
            "Inventory not found"
        );
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


    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {
        const error = new Error(
            "Quantity must be a positive integer"
        );
        error.statusCode = 400;
        throw error;
    }


    const availableQuantity =
        inventory.quantity -
        inventory.reservedQuantity;


    if (
        ["REMOVE", "DAMAGE"].includes(type) &&
        quantity > availableQuantity
    ) {

        const error = new Error(
            `${type === "DAMAGE" ? "Damage" : "Removal"} quantity cannot exceed available stock`
        );

        error.statusCode = 400;

        throw error;
    }


    if (type === "ADD") {
        inventory.quantity += quantity;
    }

    if (
        type === "REMOVE" ||
        type === "DAMAGE"
    ) {
        inventory.quantity -= quantity;
    }


    await inventory.save();


    await InventoryTransaction.create({
        productVariantId,
        type,
        quantity,
        performedBy,
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
    getInventory,
    getAllInventory,
    adjustInventory,
    updateAvailability
};