import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Truck,
    Pencil
} from "lucide-react";

import AdminFilter from "../../components/admin/common/AdminFilter";
import AdminPagination from "../../components/admin/common/AdminPagination";
import AdminStatCard from "../../components/admin/common/AdminStatCard";
import AdminModal from "../../components/admin/common/AdminModal";
import AdminShipmentForm from "../../components/admin/AdminShipmentForm";

import {
    getAdminShipments,
    updateAdminShipment
} from "../../services/admin/adminShipmentService";

import {
    toastSuccess
} from "../../utils/toast";


const AdminShipments = () => {

    // -------------------------
    // Shipments
    // -------------------------

    const [shipments, setShipments] =
        useState([]);


    const [loading, setLoading] =
        useState(false);


    const [serverError, setServerError] =
        useState("");

    const [modalError, setModalError] =
        useState("");


    // -------------------------
    // Filters
    // -------------------------

    const [search, setSearch] =
        useState("");


    const [status, setStatus] =
        useState("");


    const [sort, setSort] =
        useState("newest");


    // -------------------------
    // Pagination
    // -------------------------

    const [pagination, setPagination] =
        useState({

            page: 1,

            limit: 10,

            totalItems: 0,

            totalPages: 1

        });


    // -------------------------
    // Stats
    // -------------------------

    const [stats, setStats] =
        useState({

            pendingToday: 0,

            packedCurrent: 0,

            packedSevenDays: 0,

            shippedToday: 0,

            shippedThisWeek: 0,

            failedToday: 0

        });


    // -------------------------
    // Shipment Modal
    // -------------------------

    const [selectedShipment, setSelectedShipment] =
        useState(null);


    const [shipmentModalOpen, setShipmentModalOpen] =
        useState(false);


    const [updating, setUpdating] =
        useState(false);


    // -------------------------
    // Filter Options
    // -------------------------

    const statusOptions = [

        {
            value: "",
            label: "All Statuses"
        },

        {
            value: "PENDING",
            label: "Pending"
        },

        {
            value: "PACKED",
            label: "Packed"
        },

        {
            value: "SHIPPED",
            label: "Shipped"
        },

        {
            value: "OUT_FOR_DELIVERY",
            label: "Out for Delivery"
        },

        {
            value: "DELIVERED",
            label: "Delivered"
        },

        {
            value: "FAILED",
            label: "Failed"
        }

    ];


    const sortOptions = [

        {
            value: "newest",
            label: "Newest"
        },

        {
            value: "oldest",
            label: "Oldest"
        }

    ];


    // -------------------------
    // Fetch Shipments
    // -------------------------

    const fetchShipments =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setServerError("");


                    const result =
                        await getAdminShipments({

                            page:
                                pagination.page,

                            limit:
                                pagination.limit,

                            search,

                            status,

                            sort

                        });


                    const data =
                        result.data || {};


                    setShipments(
                        Array.isArray(
                            data.shipments
                        )
                            ? data.shipments
                            : []
                    );


                    setStats(
                        data.stats || {
                            pendingToday: 0,
                            packedCurrent: 0,
                            packedSevenDays: 0,
                            shippedToday: 0,
                            shippedThisWeek: 0,
                            failedToday: 0
                        }
                    );


                    if (data.pagination) {

                        setPagination({

                            page:
                                data.pagination.currentPage,

                            limit:
                                data.pagination.limit,

                            totalItems:
                                data.pagination.totalShipments,

                            totalPages:
                                data.pagination.totalPages

                        });

                    }

                }
                catch (error) {

                    console.error(
                        "Failed to fetch shipments:",
                        error
                    );


                    setServerError(
                        error.response?.data?.message ||
                        "Failed to load shipments."
                    );

                    setShipments([]);

                }
                finally {

                    setLoading(false);

                }

            },
            [
                pagination.page,
                pagination.limit,
                search,
                status,
                sort
            ]
        );


    useEffect(() => {

        fetchShipments();

    }, [fetchShipments]);


    // -------------------------
    // Filter Handlers
    // -------------------------

    const handleSearchChange =
        (value) => {

            setSearch(value);

            setPagination(
                previous => ({
                    ...previous,
                    page: 1
                })
            );

        };


    const handleStatusChange =
        (value) => {

            setStatus(value);

            setPagination(
                previous => ({
                    ...previous,
                    page: 1
                })
            );

        };


    const handleSortChange =
        (value) => {

            setSort(value);

            setPagination(
                previous => ({
                    ...previous,
                    page: 1
                })
            );

        };


    // -------------------------
    // Pagination
    // -------------------------

    const handlePageChange =
        (page) => {

            setPagination(
                previous => ({
                    ...previous,
                    page
                })
            );

        };


    // -------------------------
    // Shipment Modal
    // -------------------------

    const openShipmentModal =
        (shipment) => {

            setSelectedShipment(
                shipment
            );

            setModalError("");

            setShipmentModalOpen(true);

        };


    const closeShipmentModal =() => {

        if (updating) {
            return;
        }

        setShipmentModalOpen(false);

        setSelectedShipment(null);

        setModalError("");

    };


    // -------------------------
    // Update Shipment
    // -------------------------

    const handleShipmentUpdate =
        async (formData) => {

            if (!selectedShipment) {
                return;
            }


            try {

                setUpdating(true);

                setModalError("");


                const result =
                    await updateAdminShipment(

                        selectedShipment._id,

                        formData

                    );


                toastSuccess(
                    result.message ||
                    "Shipment updated successfully"
                );


                setShipmentModalOpen(false);

                setSelectedShipment(null);

                setModalError("");


                await fetchShipments();

            }
            catch (error) {

                console.error(
                    "Shipment update failed:",
                    error
                );


                setModalError(
                    error.response?.data?.message ||
                    "Failed to update shipment."
                );

            }
            finally {

                setUpdating(false);

            }

        };


    // -------------------------
    // Helpers
    // -------------------------

    const getStatusLabel =
        (shipmentStatus) => {

            return shipmentStatus
                ?.replaceAll(
                    "_",
                    " "
                )
                .toLowerCase()
                .replace(
                    /\b\w/g,
                    character =>
                        character.toUpperCase()
                ) || "-";

        };


    const getStatusClass =
        (shipmentStatus) => {

            switch (shipmentStatus) {

                case "DELIVERED":

                    return "admin-status-active";


                case "FAILED":

                    return "admin-status-inactive";


                case "PACKED":
                case "SHIPPED":
                case "OUT_FOR_DELIVERY":

                    return `
                        inline-flex
                        rounded-full
                        bg-blue-50
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-blue-700
                    `;


                case "PENDING":

                    return `
                        inline-flex
                        rounded-full
                        bg-yellow-50
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-yellow-700
                    `;


                default:

                    return `
                        inline-flex
                        rounded-full
                        bg-gray-100
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-gray-700
                    `;

            }

        };


    const formatDate =
        (date) => {

            if (!date) {
                return "-";
            }

            return new Date(date)
                .toLocaleString(
                    "en-IN",
                    {
                        dateStyle: "medium",
                        timeStyle: "short"
                    }
                );

        };


    // -------------------------
    // Render
    // -------------------------

    return (

        <div className="space-y-6">


            {/* -------------------------
                Header
            ------------------------- */}

            <div>

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-gray-900
                        text-white
                    ">

                        <Truck
                            size={20}
                        />

                    </div>


                    <div>

                        <h1 className="
                            text-2xl
                            font-semibold
                            text-gray-900
                        ">
                            Shipments
                        </h1>


                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            Manage and track customer shipments.
                        </p>

                    </div>

                </div>

            </div>


            {/* -------------------------
                Stats
            ------------------------- */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-6
            ">

                <AdminStatCard
                    label="Pending Today"
                    value={
                        stats.pendingToday
                    }
                />


                <AdminStatCard
                    label="Packed Current"
                    value={
                        stats.packedCurrent
                    }
                />


                <AdminStatCard
                    label="Packed 7+ Days"
                    value={
                        stats.packedSevenDays
                    }
                />


                <AdminStatCard
                    label="Shipped Today"
                    value={
                        stats.shippedToday
                    }
                />


                <AdminStatCard
                    label="Shipped This Week"
                    value={
                        stats.shippedThisWeek
                    }
                />


                <AdminStatCard
                    label="Failed Today"
                    value={
                        stats.failedToday
                    }
                />

            </div>


            {/* -------------------------
                Filters
            ------------------------- */}

            <AdminFilter

                search={search}

                onSearchChange={
                    handleSearchChange
                }

                searchPlaceholder="
                    Search order number or tracking number...
                "

                status={status}

                onStatusChange={
                    handleStatusChange
                }

                statusOptions={
                    statusOptions
                }

                sort={sort}

                onSortChange={
                    handleSortChange
                }

                sortOptions={
                    sortOptions
                }

            />


            {/* -------------------------
                Server Error
            ------------------------- */}

            {serverError && (

                <div className="admin-error">

                    {serverError}

                </div>

            )}


            {/* -------------------------
                Shipment Table
            ------------------------- */}

            <div className="
                admin-card
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="admin-table">

                        <thead>

                            <tr className="
                                border-b
                                border-gray-200
                            ">

                                <th className="admin-table-header">
                                    Order
                                </th>


                                <th className="admin-table-header">
                                    Status
                                </th>


                                <th className="admin-table-header">
                                    Carrier
                                </th>


                                <th className="admin-table-header">
                                    Tracking Number
                                </th>


                                <th className="admin-table-header">
                                    Shipped
                                </th>


                                <th className="admin-table-header">
                                    Delivered
                                </th>


                                <th className="admin-table-header">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading && (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        Loading shipments...
                                    </td>

                                </tr>

                            )}


                            {!loading &&
                                shipments.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        No shipments found.
                                    </td>

                                </tr>

                            )}


                            {!loading &&
                                shipments.map(
                                    shipment => (

                                    <tr
                                        key={
                                            shipment._id
                                        }
                                        className="
                                            border-b
                                            border-gray-100
                                        "
                                    >

                                        {/* Order */}

                                        <td className="admin-table-cell">

                                            <div>

                                                <p className="
                                                    font-medium
                                                    text-gray-900
                                                ">
                                                    {
                                                        shipment
                                                            .orderId
                                                            ?.orderNumber ||
                                                        "-"
                                                    }
                                                </p>


                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-gray-500
                                                ">
                                                    {
                                                        formatDate(
                                                            shipment.createdAt
                                                        )
                                                    }
                                                </p>

                                            </div>

                                        </td>


                                        {/* Status */}

                                        <td className="admin-table-cell">

                                            <span
                                                className={
                                                    getStatusClass(
                                                        shipment.status
                                                    )
                                                }
                                            >
                                                {
                                                    getStatusLabel(
                                                        shipment.status
                                                    )
                                                }
                                            </span>

                                        </td>


                                        {/* Carrier */}

                                        <td className="admin-table-cell">

                                            {
                                                shipment.carrier ||
                                                "-"
                                            }

                                        </td>


                                        {/* Tracking */}

                                        <td className="
                                            admin-table-cell
                                            whitespace-nowrap
                                        ">

                                            {
                                                shipment.trackingNumber ||
                                                "-"
                                            }

                                        </td>


                                        {/* Shipped */}

                                        <td className="admin-table-cell">

                                            {
                                                formatDate(
                                                    shipment.shippedAt
                                                )
                                            }

                                        </td>


                                        {/* Delivered */}

                                        <td className="admin-table-cell">

                                            {
                                                formatDate(
                                                    shipment.deliveredAt
                                                )
                                            }

                                        </td>


                                        {/* Action */}

                                        <td className="admin-table-cell">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openShipmentModal(
                                                        shipment
                                                    )
                                                }
                                                disabled={loading}
                                                className="
                                                    admin-button-secondary
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    px-3
                                                    py-2
                                                "
                                            >

                                                <Pencil
                                                    size={15}
                                                />

                                                Edit

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                        </tbody>

                    </table>

                </div>


                {/* Pagination */}

                <AdminPagination

                    pagination={
                        pagination
                    }

                    loading={
                        loading
                    }

                    onPageChange={
                        handlePageChange
                    }

                />

            </div>


            {/* -------------------------
                Edit Shipment Modal
            ------------------------- */}

            <AdminModal

                open={
                    shipmentModalOpen
                }

                title="Update Shipment"

                description={
                    selectedShipment
                        ? `Order ${selectedShipment.orderId?.orderNumber || "-"}`
                        : ""
                }

                onClose={
                    closeShipmentModal
                }

                loading={
                    updating
                }

                error={
                    modalError
                }

            >

                <AdminShipmentForm

                    shipment={
                        selectedShipment
                    }

                    onSubmit={
                        handleShipmentUpdate
                    }

                    onCancel={
                        closeShipmentModal
                    }

                    loading={
                        updating
                    }

                />

            </AdminModal>

        </div>

    );

};


export default AdminShipments;