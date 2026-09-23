const {
    getShipment,
    getAllShipments,
    updateShipment
} = require("../services/shipmentService");


const getAll = async (req, res, next) => {

    try {

        const shipments =
            await getAllShipments({
                page: req.query.page,
                limit: req.query.limit,
                search: req.query.search,
                status: req.query.status,
                sort: req.query.sort
            });

        return res.status(200).json({
            success: true,
            data: shipments
        });

    }
    catch (err) {

        next(err);

    }
};


const getOne = async (req, res, next) => {

    try {

        const shipment =
            await getShipment(
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


const update = async (req, res, next) => {

    try {

        const shipment =
            await updateShipment(
                req.params.shipmentId,
                {
                    status:
                        req.body.status,

                    carrier:
                        req.body.carrier,

                    trackingNumber:
                        req.body.trackingNumber
                }
            );

        return res.status(200).json({
            success: true,
            message:
                "Shipment updated successfully",
            data: shipment
        });

    }
    catch (err) {

        next(err);

    }
};


module.exports = {
    getAll,
    getOne,
    update
};