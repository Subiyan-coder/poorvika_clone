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

import Advertisement from "../pages/admin/Advertisement";

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
                    path="advertisements"
                    element={<Advertisement />}
                />

            </Route>

        </Routes>
    );
};


export default AdminRoutes;