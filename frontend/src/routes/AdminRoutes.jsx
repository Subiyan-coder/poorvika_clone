import {
    Routes,
    Route
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";

import AdminCategories from "../pages/admin/AdminCategories";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductVariants from "../pages/admin/AdminProductVariants";

import AdminInventory from "../pages/admin/AdminInventory";
import AdminInventoryTransactions from "../pages/admin/AdminInventoryTransactions";

import AdminOrders from "../pages/admin/AdminOrders";
import AdminOrderDetails from "../pages/admin/AdminOrderDetails";
import AdminShipments from "../pages/admin/AdminShipments";

import AdminPayments from "../pages/admin/AdminPayments";

import Advertisement from "../pages/admin/Advertisement";

import ProfileRoutes from "./ProfileRoutes";


const AdminRoutes = () => {

    return (
        <Routes>

            <Route
                element={<AdminLayout />}
            >

                <Route
                    index
                    element={<AdminDashboard />}
                />

                <Route
                    path="categories"
                    element={<AdminCategories />}
                />

                <Route
                    path="products"
                    element={<AdminProducts />}
                />

                <Route
                    path="product-variants"
                    element={<AdminProductVariants />}
                />

                <Route
                    path="inventory"
                    element={<AdminInventory />}
                />

                <Route
                    path="transactions"
                    element={<AdminInventoryTransactions />}
                />

                <Route
                    path="orders"
                    element={<AdminOrders />}
                />

                <Route
                    path="orders/:orderId"
                    element={
                        <AdminOrderDetails />
                    }
                />

                <Route
                    path="shipments"
                    element={
                        <AdminShipments />
                    }
                />

                <Route
                    path="payments"
                    element={
                        <AdminPayments />
                    }
                />
                
                <Route
                    path="advertisements"
                    element={<Advertisement />}
                />

                <Route
                    path="profile/*"
                    element={<ProfileRoutes />}
                />

            </Route>

        </Routes>
    );
};


export default AdminRoutes;