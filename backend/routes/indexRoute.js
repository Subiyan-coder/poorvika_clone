const express = require("express");

const authRoutes = require("./authRoute");

const customerProfileRoute = require("./customerProfileRoute");
const addressRoute = require("./addressRoute");
const passwordRoute = require("./passwordRoute");
const accountRoute = require("./accountRoute");

const categoryRoute = require("./categoryRoute");

const productRoute = require("./productRoute");

const ProductVariantRoute = require("./productVariantRoute");


const router = express.Router();

// auth routes

router.use(
    "/auth",
    authRoutes
);


// customer routes

router.use(
    "/customer",
    customerProfileRoute
);

router.use(
    "/customer/addresses",
    addressRoute
);

router.use(
    "/customer/password",
    passwordRoute
);

router.use(
    "/customer/account",
    accountRoute
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

module.exports = router;