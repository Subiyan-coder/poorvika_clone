import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    toastSuccess,
    toastError
} from "../../utils/toast";

import { useAuth } from "../../context/useAuth";

import api from "../../services/api";

const Navbar = () => {

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const [loggingOut, setLoggingOut] = useState(false);


    const handleLogout = async () => {

        try {

            setLoggingOut(true);

            await api.post("/auth/logout");

            setUser(null);

            toastSuccess(
                "Logged out successfully"
            );

            navigate("/");

        }
        catch (error) {

            toastError(
                error.response?.data?.message ||
                "Logout failed"
            );

        }
        finally {

            setLoggingOut(false);

        }
    };

    return (

                <header className="
                    flex
                    h-16
                    items-center
                    justify-between
                    border-b
                    border-gray-200
                    bg-white
                    px-6
                ">

                    {/* Brand */}

                    <div className="
                        text-lg
                        font-semibold
                        tracking-tight
                        text-gray-900
                    ">
                        POORVIKA ADMIN
                    </div>


                    {/* Right Side */}

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <button
                            type="button"
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-2
                                py-1.5
                                transition
                                hover:bg-gray-50
                            "
                            onClick={() => navigate("/admin/address")}
                        >
                            Address
                        </button>

                        {/* Admin Profile */}

                        <button
                            type="button"
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-2
                                py-1.5
                                transition
                                hover:bg-gray-50
                            "
                        >

                            <div className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-full
                                bg-gray-100
                            ">
                                <User
                                    size={18}
                                    className="text-gray-500"
                                />
                            </div>


                            <div className="
                                hidden
                                text-left
                                sm:block
                            ">
                                <p className="
                                    text-sm
                                    font-medium
                                    text-gray-900
                                ">
                                    Admin
                                </p>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">
                                    Administrator
                                </p>
                            </div>

                        </button>


                        {/* Logout */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-gray-600
                                transition
                                hover:bg-gray-50
                                hover:text-gray-900
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <LogOut
                                size={18}
                            />

                            {loggingOut
                                ? "Logging out..."
                                : "Logout"
                            }

                        </button>

                    </div>

                </header>

            );
};


export default Navbar;