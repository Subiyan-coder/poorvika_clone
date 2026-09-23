import {
    useEffect,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    Plus,
    Pencil,
    Trash2,
    Star,
    MapPin
} from "lucide-react";

import AddressForm from "../components/AddressForm";

import {
    getAllAddresses,
    deleteAddress,
    setDefaultAddress
} from "../services/addressService";

import {
    toastSuccess,
    toastError
} from "../utils/toast";

import { useAuth } from "../context/useAuth";


const Address = () => {

    const { user } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();

    const [addresses, setAddresses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingAddress, setEditingAddress] =
        useState(null);

    const [deletingId, setDeletingId] =
        useState(null);

    const [defaultId, setDefaultId] =
        useState(null);


    const isAdmin =
        user?.role === "ADMIN";


    // =========================
    // Load Addresses
    // =========================

    const loadAddresses = async () => {

        try {

            setLoading(true);

            const result =
                await getAllAddresses();

            setAddresses(
                result.data || []
            );

        }
        catch (error) {
            const err = error;
        }
        finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadAddresses();

    }, []);


    // =========================
    // Add Address
    // =========================

    const handleAdd = () => {

        setEditingAddress(null);

        setShowForm(true);
    };


    // =========================
    // Edit Address
    // =========================

    const handleEdit = (address) => {

        setEditingAddress(address);

        setShowForm(true);
    };


    // =========================
    // Form Success
    // =========================

    const handleFormSuccess = async () => {

        setShowForm(false);

        setEditingAddress(null);

        await loadAddresses();

        const checkoutReturnUrl =
            sessionStorage.getItem(
                "checkoutReturnUrl"
            );

        if (checkoutReturnUrl) {

            sessionStorage.removeItem(
                "checkoutReturnUrl"
            );

            navigate(
                checkoutReturnUrl,
                {
                    replace: true
                }
            );

            return;
        }

    };

    // =========================
    // Close Form
    // =========================

    const handleFormCancel = () => {

        setShowForm(false);

        setEditingAddress(null);

    };


    // =========================
    // Delete Address
    // =========================

    const handleDelete = async (addressId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this address?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(addressId);

            await deleteAddress(addressId);

            toastSuccess(
                "Address deleted successfully"
            );

            await loadAddresses();

        }
        catch (error) {

            toastError(
                error.response?.data?.message ||
                "Failed to delete address"
            );

        }
        finally {

            setDeletingId(null);

        }
    };


    // =========================
    // Set Default
    // =========================

    const handleSetDefault = async (addressId) => {

        try {

            setDefaultId(addressId);

            await setDefaultAddress(addressId);

            toastSuccess(
                "Default address updated successfully"
            );

            await loadAddresses();

        }
        catch (error) {

            toastError(
                error.response?.data?.message ||
                "Failed to update default address"
            );

        }
        finally {

            setDefaultId(null);

        }
    };


    // =========================
    // Loading
    // =========================

    if (loading) {

        return (
            <div className="
                flex
                min-h-[400px]
                items-center
                justify-center
            ">

                <p className="
                    text-sm
                    text-gray-500
                ">
                    Loading addresses...
                </p>

            </div>
        );
    }


    // =========================
    // Form
    // =========================

    if (showForm) {

        return (
            <div className="
                mx-auto
                w-full
                max-w-3xl
                px-4 
                py-8 
                sm:px-6 
                lg:px-8
            ">

                <div className="
                    mb-6
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <h1 className="
                            text-2xl
                            font-semibold
                            text-gray-900
                        ">
                            {editingAddress
                                ? "Edit Address"
                                : "Add Address"
                            }
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            {isAdmin
                                ? "Manage your admin address."
                                : "Add or update your delivery address."
                            }
                        </p>

                    </div>

                </div>


                <AddressForm
                    address={editingAddress}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />

            </div>
        );
    }


    // =========================
    // Address Page
    // =========================

    return (
        <div className="
            mx-auto
            w-full
            max-w-5xl
        ">

            {/* Header */}

            <div className="
                mb-8
                flex
                items-center
                justify-between
                gap-4
            ">

                <div>

                    <h1 className="
                        text-2xl
                        font-semibold
                        text-gray-900
                    ">
                        My Addresses
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">
                        Manage your saved addresses.
                    </p>

                </div>


                {/* Add button */}

                {(!isAdmin || addresses.length === 0) && (

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-gray-900
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-gray-800
                        "
                    >

                        <Plus size={18} />

                        Add Address

                    </button>

                )}

            </div>


            {/* Empty State */}

            {addresses.length === 0 && (

                <div className="
                    flex
                    min-h-[300px]
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-gray-300
                    bg-gray-50
                    px-6
                    text-center
                ">

                    <div className="
                        mb-4
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-gray-500
                        shadow-sm
                    ">

                        <MapPin size={22} />

                    </div>


                    <h2 className="
                        text-base
                        font-semibold
                        text-gray-900
                    ">
                        No address added
                    </h2>


                    <p className="
                        mt-1
                        max-w-sm
                        text-sm
                        text-gray-500
                    ">
                        Add an address to make delivery
                        and checkout easier.
                    </p>

                </div>

            )}


            {/* Address List */}

            {addresses.length > 0 && (

                <div className="
                    grid
                    gap-5
                    md:grid-cols-2
                ">

                    {addresses.map((address) => (

                        <div
                            key={address._id}
                            className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            {/* Top */}

                            <div className="
                                mb-4
                                flex
                                items-start
                                justify-between
                                gap-3
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <span className="
                                        rounded-lg
                                        bg-gray-100
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-gray-700
                                    ">
                                        {address.type}
                                    </span>


                                    {address.isDefault && (

                                        <span className="
                                            flex
                                            items-center
                                            gap-1
                                            rounded-lg
                                            bg-gray-900
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            text-white
                                        ">

                                            <Star
                                                size={12}
                                                fill="currentColor"
                                            />

                                            Default

                                        </span>

                                    )}

                                </div>


                                {/* Actions */}

                                <div className="
                                    flex
                                    items-center
                                    gap-1
                                ">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(address)
                                        }
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            text-gray-500
                                            transition
                                            hover:bg-gray-100
                                            hover:text-gray-900
                                        "
                                        aria-label="Edit address"
                                    >

                                        <Pencil size={16} />

                                    </button>


                                    {/* Customers can delete.
                                        Admin cannot delete from UI. */}

                                    {!isAdmin && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    address._id
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                address._id
                                            }
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-gray-500
                                                transition
                                                hover:bg-red-50
                                                hover:text-red-600
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                            aria-label="Delete address"
                                        >

                                            <Trash2 size={16} />

                                        </button>

                                    )}

                                </div>

                            </div>


                            {/* Address */}

                            <div className="
                                space-y-1.5
                                text-sm
                                text-gray-600
                            ">

                                <p className="
                                    font-semibold
                                    text-gray-900
                                ">
                                    {address.name}
                                </p>


                                <p>
                                    {address.phone}
                                </p>


                                <p>
                                    {address.houseNo &&
                                        `${address.houseNo}, `
                                    }

                                    {address.addressLine1}
                                </p>


                                {address.addressLine2 && (

                                    <p>
                                        {address.addressLine2}
                                    </p>

                                )}


                                <p>
                                    {address.area},{" "}
                                    {address.city}
                                </p>


                                <p>
                                    {address.state} -{" "}
                                    {address.postalCode}
                                </p>


                                <p>
                                    {address.country}
                                </p>

                            </div>


                            {/* Default button */}

                            {!isAdmin &&
                                !address.isDefault && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetDefault(
                                                address._id
                                            )
                                        }
                                        disabled={
                                            defaultId ===
                                            address._id
                                        }
                                        className="
                                            mt-5
                                            text-sm
                                            font-medium
                                            text-gray-700
                                            transition
                                            hover:text-gray-900
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        {defaultId ===
                                        address._id
                                            ? "Updating..."
                                            : "Set as default"
                                        }

                                    </button>

                                )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};


export default Address;