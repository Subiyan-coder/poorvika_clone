import {
    Search,
    Heart,
    ShoppingCart,
    User,
    ChevronDown,
    MapPin,
    LogOut,
    Package,
    UserCircle
} from "lucide-react";

import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    toastSuccess,
    toastError
} from "../../utils/toast";

import {
    useAuth
} from "../../context/useAuth";

import api from "../../services/api";


const Navbar = () => {

    const navigate = useNavigate();

    const {
        user,
        isAuthenticated,
        setUser
    } = useAuth();


    const [search, setSearch] = useState("");

    const [accountOpen, setAccountOpen] =
        useState(false);

    const [loggingOut, setLoggingOut] =
        useState(false);


    const handleSearch = (event) => {

        event.preventDefault();

        const value = search.trim();

        if (!value) {
            return;
        }

        navigate(
            `/search?q=${encodeURIComponent(value)}`
        );

    };


    const handleLogout = async () => {

        if (loggingOut) {
            return;
        }

        try {

            setLoggingOut(true);

            await api.post(
                "/auth/logout"
            );

            setUser(null);

            setAccountOpen(false);

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
        <header className="border-b border-gray-200 bg-white">

            <div className="
                mx-auto
                flex
                h-20
                max-w-7xl
                items-center
                gap-6
                px-4
                sm:px-6
                lg:px-8
            ">


                {/* Logo */}

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="
                        shrink-0
                        text-2xl
                        font-bold
                        tracking-tight
                        text-gray-900
                    "
                >
                    POORVIKA
                </button>


                {/* Search */}

                <form
                    onSubmit={handleSearch}
                    className="flex flex-1"
                >

                    <div className="
                        flex
                        w-full
                        items-center
                        overflow-hidden
                        rounded-lg
                        border
                        border-gray-300
                        bg-gray-50
                        focus-within:border-gray-900
                        focus-within:bg-white
                    ">

                        <Search
                            size={20}
                            className="
                                ml-4
                                shrink-0
                                text-gray-500
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search products"
                            className="
                                w-full
                                bg-transparent
                                px-3
                                py-3
                                text-sm
                                text-gray-900
                                outline-none
                                placeholder:text-gray-400
                            "
                        />

                        <button
                            type="submit"
                            className="
                                border-l
                                border-gray-300
                                px-5
                                py-3
                                text-sm
                                font-medium
                                text-gray-700
                                transition
                                hover:bg-gray-100
                            "
                        >
                            Search
                        </button>

                    </div>

                </form>


                {/* Wishlist */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/wishlist")
                    }
                    className="
                        hidden
                        shrink-0
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:text-gray-900
                        md:flex
                    "
                >

                    <Heart size={21} />

                    <span>
                        Wishlist
                    </span>

                </button>


                {/* Cart */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/cart")
                    }
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:text-gray-900
                    "
                >

                    <ShoppingCart size={21} />

                    <span className="hidden sm:inline">
                        Cart
                    </span>

                </button>


                {/* Account */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={() =>
                            setAccountOpen(
                                (previous) =>
                                    !previous
                            )
                        }
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:text-gray-900
                        "
                    >

                        {user?.profileImage?.url ? (

                            <img
                                src={
                                    user.profileImage.url
                                }
                                alt="Profile"
                                className="
                                    h-8
                                    w-8
                                    rounded-full
                                    object-cover
                                "
                            />

                        ) : (

                            <User size={21} />

                        )}

                        <span className="hidden sm:inline">
                            {isAuthenticated
                                ? "My Account"
                                : "Sign In"
                            }
                        </span>

                        <ChevronDown
                            size={16}
                            className="
                                hidden
                                sm:block
                            "
                        />

                    </button>


                    {/* Account Dropdown */}

                    {accountOpen && (

                        <div className="
                            absolute
                            right-0
                            top-full
                            z-50
                            mt-3
                            w-56
                            overflow-hidden
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            shadow-lg
                        ">

                            {isAuthenticated ? (

                                <>

                                    {/* User */}

                                    <div className="
                                        border-b
                                        border-gray-100
                                        px-4
                                        py-3
                                    ">

                                        <p className="
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                        ">
                                            {user?.name}
                                        </p>

                                        <p className="
                                            truncate
                                            text-xs
                                            text-gray-500
                                        ">
                                            {user?.email ||
                                                user?.phone}
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAccountOpen(false);
                                            navigate(
                                                "/profile"
                                            );
                                        }}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-sm
                                            text-gray-700
                                            hover:bg-gray-50
                                        "
                                    >

                                        <UserCircle
                                            size={18}
                                        />

                                        My Profile

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAccountOpen(false);
                                            navigate(
                                                "/account/orders"
                                            );
                                        }}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-sm
                                            text-gray-700
                                            hover:bg-gray-50
                                        "
                                    >

                                        <Package
                                            size={18}
                                        />

                                        My Orders

                                    </button>
                                    
                                    <button
                                        type="button"
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-sm
                                            text-gray-700
                                            hover:bg-gray-50
                                        "
                                        onClick={() => {
                                            setAccountOpen(false);
                                            navigate("/profile/address");
                                        }}
                                    >
                                        <MapPin size={18} />

                                        <span>
                                            Addresses
                                        </span>

                                    </button>

                                    <button
                                        type="button"
                                        disabled={loggingOut}
                                        onClick={handleLogout}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            border-t
                                            border-gray-100
                                            px-4
                                            py-3
                                            text-sm
                                            text-red-600
                                            hover:bg-red-50
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

                                </>

                            ) : (

                                <button
                                    type="button"
                                    onClick={() => {
                                        setAccountOpen(false);
                                        navigate("/login");
                                    }}
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        hover:bg-gray-50
                                    "
                                >

                                    <User
                                        size={18}
                                    />

                                    Sign In

                                </button>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
};


export default Navbar;