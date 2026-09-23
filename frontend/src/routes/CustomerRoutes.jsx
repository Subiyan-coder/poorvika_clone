import {
    Routes,
    Route
} from "react-router-dom";

import CustomerLayout from "../layouts/CustomerLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";
import RegisterDetails from "../pages/RegisterDetails";
import LoginOtp from "../pages/LoginOtp";

import ProductDetails from "../pages/ProductDetails";
import ProductVariant from "../pages/PraductVariant";

import ProfileRoutes from "./ProfileRoutes";
import Cart from "../pages/Cart";

import Order from "../pages/Order";
import Payment from "../pages/Payment";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";



const CustomerRoutes = () => {

    return (
        <Routes>

            <Route
                path="/"
                element={<CustomerLayout />}
            >

                {/* Home */}

                <Route
                    index
                    element={<Home />}
                />

                <Route
                    path="products/:productId"
                    element={<ProductDetails />}
                />

                <Route
                    path="product-variants/:variantId"
                    element={<ProductVariant />}
                />

                <Route
                    path="cart"
                    element={<Cart />}
                />

                {/* Order */}

                <Route
                    path="order"
                    element={<Order />}
                />

                <Route
                    path="payment"
                    element={<Payment />}
                />

                <Route
                    path="my-orders"
                    element={
                        <MyOrders />
                    }
                />

                <Route
                    path="my-orders/:orderId"
                    element={<OrderDetails />}
                />

                {/* =========================
                    PROFILE
                ========================= */}

                <Route
                    path="profile/*"
                    element={<ProfileRoutes />}
                />


                {/* =========================
                    AUTH MODALS
                ========================= */}

                <Route
                    element={<AuthLayout />}
                >

                    <Route
                        path="login"
                        element={<Login />}
                    />

                    <Route
                        path="login/otp"
                        element={<LoginOtp />}
                    />

                    <Route
                        path="register"
                        element={<Register />}
                    />

                    <Route
                        path="verify-otp"
                        element={<VerifyOtp />}
                    />

                    <Route
                        path="register/details"
                        element={<RegisterDetails />}
                    />

                </Route>

            </Route>

        </Routes>
    );
};


export default CustomerRoutes;