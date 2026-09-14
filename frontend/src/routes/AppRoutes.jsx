import {
    Routes,
    Route
} from "react-router-dom";

import AuthRoute from "./AuthRoute";
import AdminRoutes from "./AdminRoutes";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Home";


const AppRoutes = () => {

    return (
        <Routes>

            {/* Admin */}

            <Route
                path="/admin/*"
                element={<AdminRoutes />}
            />


            {/* Customer */}

            <Route
                element={<CustomerLayout />}
            >

                <Route
                    path="/"
                    element={<Home />}
                />

            </Route>


            {/* Authentication */}

            <Route
                path="/*"
                element={<AuthRoute />}
            />

        </Routes>
    );
};


export default AppRoutes;