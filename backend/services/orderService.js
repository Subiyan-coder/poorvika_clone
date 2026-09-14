const mongoose = require("mongoose");

const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
const ProductVariant = require("../models/productVariant");
const Product = require("../models/product");
const Inventory = require("../models/inventory");
const InventoryTransaction = require("../models/inventoryTransaction");
const Coupon = require("../models/coupon");
const CouponUsage = require("../models/couponUsage");

const generateOrderNumber = () => {

    const timestamp = Date.now();
    const random = Math.floor(
        1000 + Math.random() * 9000
    );

    return `PV${timestamp}${random}`;
};

const getShippingAddress = async (
    userId,
    addressId,
    session
) => {

    const address = await Address.findOne({
        _id: addressId,
        userId
    }).session(session);

    if (!address) {
        const error = new Error(
            "Shipping address not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return address;
};

const buildShippingAddress = (address) => {

    return {
        name: address.name,
        phone: address.phone,
        alternativePhone: address.alternativePhone,
        houseNo: address.houseNo,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        area: address.area,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country
    };
};


const buildOrderItems = async (
    items,
    session
) => {

    const orderItems = [];

    for (const item of items) {

        const variant = await ProductVariant.findOne({
            _id: item.productVariantId,
            isActive: true
        }).session(session);

        if (!variant) {
            const error = new Error(
                "One or more selected products are unavailable"
            );
            error.statusCode = 400;
            throw error;
        }


        const product = await Product.findOne({
            _id: variant.productId,
            isActive: true
        }).session(session);

        if (!product) {
            const error = new Error(
                "One or more selected products are unavailable"
            );
            error.statusCode = 400;
            throw error;
        }


        const inventory = await Inventory.findOne({
            productVariantId: variant._id,
            isAvailable: true
        }).session(session);

        if (!inventory) {
            const error = new Error(
                `${variant.sku} is currently unavailable`
            );
            error.statusCode = 400;
            throw error;
        }


        const availableQuantity =
            inventory.quantity -
            inventory.reservedQuantity;


        if (item.quantity > availableQuantity) {
            const error = new Error(
                `Only ${availableQuantity} units of ${variant.sku} are available`
            );
            error.statusCode = 400;
            throw error;
        }


        const unitPrice =
            variant.discountPrice > 0
                ? variant.discountPrice
                : variant.price;


        const totalPrice =
            unitPrice * item.quantity;


        orderItems.push({

            productVariantId:
                variant._id,

            productName:
                product.name,

            sku:
                variant.sku,

            attributes:
                variant.attributes,

            quantity:
                item.quantity,

            unitPrice,

            totalPrice,

            productId:
                product._id,

            categoryId:
                product.categoryId
        });
    }


    return orderItems;
};


const reserveInventory = async (
    userId,
    orderItems,
    orderId,
    session
) => {

    for (const item of orderItems) {

        const inventory = await Inventory.findOneAndUpdate(
            {
                productVariantId: item.productVariantId,
                isAvailable: true,
                $expr: {
                    $gte: [
                        {
                            $subtract: [
                                "$quantity",
                                "$reservedQuantity"
                            ]
                        },
                        item.quantity
                    ]
                }
            },
            {
                $inc: {
                    reservedQuantity: item.quantity
                }
            },
            {
                new: true,
                session
            }
        );

        if (!inventory) {
            const error = new Error(
                `Insufficient stock for ${item.sku}`
            );
            error.statusCode = 400;
            throw error;
        }

        await InventoryTransaction.create(
            [{
                performedBy: user.id,
                productVariantId: item.productVariantId,
                type: "RESERVATION",
                quantity: item.quantity,
                referenceId: orderId,
                note: "Inventory reserved for order"
            }],
            { session }
        );
    }
};


const createOrder = async ({
    userId,
    address,
    orderItems,
    couponCode,
    session
}) => {

    const subtotal = orderItems.reduce(
        (sum, item) =>
            sum + item.totalPrice,
        0
    );


    const shippingCharge =
        await calculateShippingCharge({
            userId,
            subtotal
        });

    let couponResult = null;
    let discountAmount = 0;
    let appliedCouponCode = null;
    let couponId = null;


    if (
        couponCode &&
        couponCode.trim()
    ) {

        const couponResult =
            await validateCoupon({
                userId,
                code: couponCode,
                items: orderItems
            });


        couponId =
            couponResult.couponId;

        appliedCouponCode =
            couponResult.code;

        discountAmount =
            couponResult.discountAmount;
    }

    if (couponId) {

    const couponUpdateFilter = {
        _id: couponId,
        isActive: true
    };

    if (couponResult.usageLimit !== null) {
        couponUpdateFilter.$expr = {
            $lt: [
                "$usedCount",
                "$usageLimit"
            ]
        };
    }

    const updatedCoupon =
        await Coupon.findOneAndUpdate(
            couponUpdateFilter,
            {
                $inc: {
                    usedCount: 1
                }
            },
            {
                new: true,
                session
            }
        );

    if (!updatedCoupon) {
            const error = new Error(
                "Coupon usage limit has been reached"
            );
            error.statusCode = 400;
            throw error;
        }


        await CouponUsage.create(
            [{
                couponId,
                userId,
                orderId: order._id,
                discountAmount
            }],
            { session }
        );
    }


    const totalAmount = Math.max(
        0,
        subtotal -
        discountAmount +
        shippingCharge
    );


    const order = new Order({

        userId,

        orderNumber:
            generateOrderNumber(),

        items:
            orderItems,

        shippingAddress:
            buildShippingAddress(address),

        subtotal,

        couponCode:
            appliedCouponCode,

        discountAmount,

        shippingCharge,

        totalAmount,

        status: "PENDING"
    });


    await order.save({
        session
    });


    await reserveInventory(
        orderItems,
        order._id,
        session
    );


    if (couponId) {

        await CouponUsage.create(
            [{
                couponId,
                userId,
                orderId:
                    order._id,
                discountAmount
            }],
            { session }
        );


        const couponUpdateFilter = {
            _id: couponId,
            isActive: true
        };

        if (couponResult.usageLimit !== null) {
            couponUpdateFilter.$expr = {
                $lt: [
                    "$usedCount",
                    "$usageLimit"
                ]
            };
        }

        const updatedCoupon =
            await Coupon.findOneAndUpdate(
                couponUpdateFilter,
                {
                    $inc: {
                        usedCount: 1
                    }
                },
                {
                    new: true,
                    session
                }
            );

        if (!updatedCoupon) {
            const error = new Error(
                "Coupon usage limit has been reached"
            );
            error.statusCode = 400;
            throw error;
        }
    }


    return order;
};

const createOrderFromCart = async (
    userId,
    addressId,
    couponCode
) => {

    const session = await mongoose.startSession();

    try {

        let createdOrder;

        await session.withTransaction(async () => {

            const address =
                await getShippingAddress(
                    userId,
                    addressId,
                    session
                );


            const cart = await Cart.findOne({
                userId
            }).session(session);

            if (!cart || cart.items.length === 0) {
                const error = new Error(
                    "Cart is empty"
                );
                error.statusCode = 400;
                throw error;
            }


            const selectedItems =
                cart.items.filter(
                    item => item.selected
                );


            if (selectedItems.length === 0) {
                const error = new Error(
                    "No items selected for checkout"
                );
                error.statusCode = 400;
                throw error;
            }


            const orderItems =
                await buildOrderItems(
                    selectedItems.map(item => ({
                        productVariantId:
                            item.productVariant,
                        quantity:
                            item.quantity
                    })),
                    session
                );


            createdOrder = await createOrder({
                userId,
                address,
                orderItems,
                couponCode,
                session
            });


            cart.items = cart.items.filter(
                item => !item.selected
            );


            await cart.save({
                session
            });
        });


        return createdOrder;

    }
    finally {

        await session.endSession();

    }
};


const createDirectOrder = async (
    userId,
    productVariantId,
    quantity,
    addressId,
    couponCode
) => {

    const session = await mongoose.startSession();

    try {

        let createdOrder;

        await session.withTransaction(async () => {

            const address =
                await getShippingAddress(
                    userId,
                    addressId,
                    session
                );


            const orderItems =
                await buildOrderItems(
                    [
                        {
                            productVariantId,
                            quantity
                        }
                    ],
                    session
                );


            createdOrder = await createOrder({
                userId,
                address,
                orderItems,
                couponCode,
                session
            });

        });


        return createdOrder;

    }
    finally {

        await session.endSession();
    }
};

const getMyOrders = async (userId) => {

    return Order.find({
        userId
    }).sort({
        createdAt: -1
    });
};


const getOrder = async (
    userId,
    orderId,
    isAdmin = false
) => {

    const filter = {
        _id: orderId
    };

    if (!isAdmin) {
        filter.userId = userId;
    }

    const order = await Order.findOne(filter);

    if (!order) {
        const error = new Error(
            "Order not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return order;
};


const getAllOrders = async () => {

    return Order.find()
        .sort({
            createdAt: -1
        });
};


const cancelOrder = async (
    userId,
    orderId,
    reason
) => {

    const session = await mongoose.startSession();

    try {

        let cancelledOrder;

        await session.withTransaction(async () => {

            const order = await Order.findOne({
                _id: orderId,
                userId
            }).session(session);

            if (!order) {
                const error = new Error(
                    "Order not found"
                );
                error.statusCode = 404;
                throw error;
            }

            if (
                ![
                    "PENDING",
                    "CONFIRMED",
                    "PROCESSING"
                ].includes(order.status)
            ) {
                const error = new Error(
                    "Order cannot be cancelled at its current status"
                );
                error.statusCode = 400;
                throw error;
            }

            for (const item of order.items) {

                const inventory =  await Inventory.findOneAndUpdate
                (

                    {
                        productVariantId:
                            item.productVariantId,
                        reservedQuantity: {
                            $gte: item.quantity
                        }
                    },
                    {
                        $inc: {
                            reservedQuantity:
                                -item.quantity
                        }
                    },
                    {
                        new: true,
                        session
                    }
                );

                if (!inventory) {
                    const error = new Error(
                        `Unable to release reserved inventory for ${item.sku}`
                    );
                    error.statusCode = 500;
                    throw error;
                }

                await InventoryTransaction.create(
                    [{
                        performedBy: userId,
                        
                        productVariantId:
                            item.productVariantId,

                        type: "RELEASE",

                        quantity:
                            item.quantity,

                        referenceId:
                            order._id,

                        note:
                            "Inventory released after order cancellation"
                    }],
                    { session }
                );
            }

            order.status = "CANCELLED";
            order.cancelledAt = new Date();
            order.cancellationReason = reason || null;

            await order.save({ session });

            cancelledOrder = order;
        });

        return cancelledOrder;
    }
    finally {
        await session.endSession();
    }
};


module.exports = {
    createOrderFromCart,
    createDirectOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    cancelOrder
};