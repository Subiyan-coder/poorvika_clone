import {
    Routes,
    Route
} from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";


const AppRoutes = () => {

    return (
        <Routes>

            {/* =========================
                ADMIN
            ========================= */}

            <Route
                path="/admin/*"
                element={<AdminRoutes />}
            />


            {/* =========================
                CUSTOMER
            ========================= */}

            <Route
                path="/*"
                element={<CustomerRoutes />}
            />

        </Routes>
    );
};


export default AppRoutes;