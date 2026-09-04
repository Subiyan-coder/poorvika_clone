const {
    createShipment,
    getShipment,
    getAllShipments,
    updateShipment
} = require("../services/shipmentService");

const create = async (req, res, next) => {

    try {

        const shipment = await createShipment(
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Shipment created successfully",
            data: shipment
        });

    }
    catch (err) {
        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const shipment = await getShipment(
            req.params.orderId
        );

        return res.status(200).json({
            success: true,
            data: shipment
        });

    }
    catch (err) {
        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const shipments = await getAllShipments();

        return res.status(200).json({
            success: true,
            data: shipments
        });

    }
    catch (err) {
        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const shipment = await updateShipment(
            req.params.shipmentId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Shipment updated successfully",
            data: shipment
        });

    }
    catch (err) {
        next(err);
    }
};


module.exports = {
    create,
    getOne,
    getAll,
    update
};