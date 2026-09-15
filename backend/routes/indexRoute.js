const express = require("express");

const authRoutes = require("./authRoute");

const profileRoute = require("./profileRoute");
const addressRoute = require("./addressRoute");
const passwordRoute = require("./passwordRoute");
const accountRoute = require("./accountRoute");

const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");
const ProductVariantRoute = require("./productVariantRoute");

const inventoryRoute = require("./inventoryRoute");
const inventoryTransactionRoutes = require("./inventoryTransactionRoutes");

const orderRoute = require("./orderRoute");
const couponRoute = require("./couponRoute");
const shipmentRoute = require("./shipmentRoute");
const returnRoute =  require("./returnRoute");
const paymentRoute = require("./paymentRoute");

const reviewRoute = require("./reviewRoute");

const supportRequestRoute = require("./supportRequestRoute");
const advertisementRoute = require("./advertisementRoute")


const router = express.Router();

// auth routes

router.use(
    "/auth",
    authRoutes
);


// account routes

router.use(
    "/profile",
    profileRoute
);

router.use(
    "/password",
    passwordRoute
);


router.use(
    "/account",
    accountRoute
);

router.use(
    "/addresses",
    addressRoute
);

// category routes

router.use(
    "/categories",
    categoryRoute
);

// product routes

router.use(
    "/products",
    productRoute
);

router.use(
    "/product-variants",
    ProductVariantRoute
);

// inventory routes 

router.use(
    "/inventory",
    inventoryRoute
);

router.use(
    "/inventory-transactions",
    inventoryTransactionRoutes
)

// order routes

router.use(
    "/order",
    orderRoute
);

router.use(
    "/coupons",
    couponRoute
);


router.use(
    "/shipments",
    shipmentRoute
);

router.use(
    "/returns",
    returnRoute
);


router.use(
    "/payments",
    paymentRoute
);

// review route

router.use(
    "/review",
    reviewRoute
);

// support route

router.use(
    "/support",
    supportRequestRoute
);

// ad route

router.use(
    "/advertisements",
    advertisementRoute
);

module.exports = router;