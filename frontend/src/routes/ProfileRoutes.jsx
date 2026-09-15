import {
    Routes,
    Route
} from "react-router-dom";

import Profile from "../pages/Profile";
import Address from "../pages/Address";
import Account from "../pages/Account";
import ChangePassword from "../pages/ChangePassword";


const ProfileRoutes = () => {

    return (
        <Routes>

            {/* Profile */}

            <Route
                index
                element={<Profile />}
            />


            {/* Account */}

            <Route
                path="account"
                element={<Account />}
            />


            {/* Address */}

            <Route
                path="address"
                element={<Address />}
            />


            {/* Password */}

            <Route
                path="password"
                element={<ChangePassword />}
            />

        </Routes>
    );
};


export default ProfileRoutes;