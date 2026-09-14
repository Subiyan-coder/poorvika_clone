const {
    getInventory,
    getAllInventory,
    adjustInventory,
    updateAvailability
} = require("../services/inventoryService");

const { logger } = require("../utils/logger");


const getOne = async (req, res, next) => {

    try {

        const inventory = await getInventory(
            req.params.productVariantId
        );

        return res.status(200).json({
            success: true,
            data: inventory
        });

    }
    catch (err) {

        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const inventory = await getAllInventory();

        return res.status(200).json({
            success: true,
            data: inventory
        });

    }
    catch (err) {

        next(err);
    }
};


const adjust = async (req, res, next) => {

    try {

        const inventory = await adjustInventory({

            productVariantId: req.params.productVariantId,
            quantity: req.body.quantity,
            type: req.body.type,
            note: req.body.note,
            performedBy: req.user.userId

        });

        return res.status(200).json({
            success: true,
            message: "Inventory adjusted successfully",
            data: inventory
        });

    }
    catch (err) {

        logger.error(
            `Inventory adjustment failed: ${err.message}`
        );

        next(err);
    }
};


const updateAvailabilityStatus = async (
    req,
    res,
    next
) => {

    try {

        const inventory = await updateAvailability(
            req.params.productVariantId,
            req.body.isAvailable
        );

        return res.status(200).json({
            success: true,
            message:
                "Inventory availability updated successfully",
            data: inventory
        });

    }
    catch (err) {

        logger.error(
            `Inventory availability update failed: ${err.message}`
        );

        next(err);
    }
};


module.exports = {
    getOne,
    getAll,
    adjust,
    updateAvailabilityStatus
};