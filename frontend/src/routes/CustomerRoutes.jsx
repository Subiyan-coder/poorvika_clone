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

import ProfileRoutes from "./ProfileRoutes";


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