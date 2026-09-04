const Shipment = require("../models/shipment");
const Order = require("../models/order");


const createShipment = async ({
    orderId,
    carrier,
    trackingNumber
}) => {

    const order = await Order.findById(
        orderId
    );

    if (!order) {
        const error = new Error(
            "Order not found"
        );
        error.statusCode = 404;
        throw error;
    }

    if (order.status === "CANCELLED") {
        const error = new Error(
            "Cannot create shipment for a cancelled order"
        );
        error.statusCode = 400;
        throw error;
    }

    const existingShipment =
        await Shipment.findOne({
            orderId
        });

    if (existingShipment) {
        const error = new Error(
            "Shipment already exists for this order"
        );
        error.statusCode = 409;
        throw error;
    }

    const shipment = await Shipment.create({
        orderId,
        carrier,
        trackingNumber
    });

    return shipment;
};


const getShipment = async (orderId) => {

    const shipment = await Shipment.findOne({
        orderId
    }).populate(
        "orderId",
        "orderNumber status totalAmount"
    );

    if (!shipment) {
        const error = new Error(
            "Shipment not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return shipment;
};


const getAllShipments = async () => {

    return Shipment.find()
        .populate(
            "orderId",
            "orderNumber userId status totalAmount"
        )
        .sort({
            createdAt: -1
        });
};

const updateShipment = async (
    shipmentId,
    {
        status,
        carrier,
        trackingNumber
    }
) => {

    const shipment = await Shipment.findById(
        shipmentId
    );

    if (!shipment) {
        const error = new Error(
            "Shipment not found"
        );
        error.statusCode = 404;
        throw error;
    }


    const allowedTransitions = {
        PENDING: ["PACKED", "FAILED"],
        PACKED: ["SHIPPED", "FAILED"],
        SHIPPED: ["OUT_FOR_DELIVERY", "FAILED"],
        OUT_FOR_DELIVERY: ["DELIVERED", "FAILED"],
        DELIVERED: [],
        FAILED: []
    };


    if (
        status &&
        status !== shipment.status
    ) {

        const allowed =
            allowedTransitions[
                shipment.status
            ];

        if (
            !allowed ||
            !allowed.includes(status)
        ) {
            const error = new Error(
                `Cannot change shipment status from ${shipment.status} to ${status}`
            );
            error.statusCode = 400;
            throw error;
        }

        shipment.status = status;


        if (status === "SHIPPED") {
            shipment.shippedAt = new Date();
        }


        if (status === "DELIVERED") {
            shipment.deliveredAt = new Date();
        }
    }


    if (carrier !== undefined) {
        shipment.carrier = carrier;
    }


    if (trackingNumber !== undefined) {
        shipment.trackingNumber =
            trackingNumber;
    }


    await shipment.save();

    return shipment;
};

const calculateShippingCharge = async ({
    userId,
    subtotal
}) => {

    const previousOrder = await Order.exists({
        userId,
        status: {
            $ne: "CANCELLED"
        }
    });


    // First order gets free delivery
    if (!previousOrder) {
        return 0;
    }


    // Free delivery for orders of ₹1,000 or more
    if (subtotal >= 1000) {
        return 0;
    }


    // Normal delivery charge
    return 50;
};



module.exports = {
    createShipment,
    getShipment,
    getAllShipments,
    updateShipment,
    calculateShippingCharge
};