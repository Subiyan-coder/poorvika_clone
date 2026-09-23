import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Eye
} from "lucide-react";

import AdminStatCard
    from "../../components/admin/common/AdminStatCard";

import AdminFilter
    from "../../components/admin/common/AdminFilter";

import AdminPagination
    from "../../components/admin/common/AdminPagination";

import {
    getAdminOrders
} from "../../services/admin/adminOrderService";


const AdminOrders = () => {

    const navigate = useNavigate();


    // -------------------------
    // State
    // -------------------------

    const [orders, setOrders] =
        useState([]);


    const [stats, setStats] =
        useState({
            today: 0,
            week: 0,
            month: 0,
            year: 0,
            pending: 0
        });


    const [pagination, setPagination] =
        useState({
            currentPage: 1,
            totalPages: 1,
            totalOrders: 0,
            limit: 10,
            hasNextPage: false,
            hasPreviousPage: false
        });


    const [search, setSearch] =
        useState("");


    const [status, setStatus] =
        useState("");


    const [sort, setSort] =
        useState("newest");


    const [loading, setLoading] =
        useState(true);


    const [serverError, setServerError] =
        useState("");


    // -------------------------
    // Fetch Orders
    // -------------------------

    const fetchOrders =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setServerError("");


                    const result =
                        await getAdminOrders({

                            page:
                                pagination.currentPage,

                            limit:
                                pagination.limit,

                            search,

                            status,

                            sort

                        });


                    const data =
                        result.data;


                    setOrders(
                        data.orders || []
                    );


                    setPagination(
                        data.pagination
                    );


                    setStats(
                        data.stats || {
                            today: 0,
                            week: 0,
                            month: 0,
                            year: 0,
                            pending: 0
                        }
                    );

                }
                catch (err) {

                    console.error(
                        "Failed to load orders:",
                        err
                    );


                    setServerError(
                        err?.response?.data?.message ||
                        "Unable to load orders."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                pagination.currentPage,
                pagination.limit,
                search,
                status,
                sort
            ]
        );


    useEffect(() => {

        fetchOrders();

    }, [fetchOrders]);


    // -------------------------
    // Search
    // -------------------------

    const handleSearch = (
        value
    ) => {

        setSearch(value);

        setPagination(
            previous => ({
                ...previous,
                currentPage: 1
            })
        );

    };


    // -------------------------
    // Status
    // -------------------------

    const handleStatusChange = (
        value
    ) => {

        setStatus(
            value === "ALL"
                ? ""
                : value
        );


        setPagination(
            previous => ({
                ...previous,
                currentPage: 1
            })
        );

    };


    // -------------------------
    // Sort
    // -------------------------

    const handleSortChange = (
        value
    ) => {

        setSort(value);


        setPagination(
            previous => ({
                ...previous,
                currentPage: 1
            })
        );

    };


    // -------------------------
    // Pagination
    // -------------------------

    const changePage = (
        page
    ) => {

        setPagination(
            previous => ({
                ...previous,
                currentPage: page
            })
        );

    };


    // -------------------------
    // View Order
    // -------------------------

    const handleViewOrder = (
        orderId
    ) => {

        navigate(
            `/admin/orders/${orderId}`
        );

    };


    return (

        <div className="
            space-y-6
        ">


            {/* =========================
                Header
            ========================= */}

            <div>

                <h1 className="
                    text-2xl
                    font-semibold
                    text-gray-900
                ">

                    Orders

                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-gray-500
                ">

                    Manage customer orders
                    and track their current
                    status.

                </p>

            </div>


            {/* =========================
                Statistics
            ========================= */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-5
            ">

                <AdminStatCard
                    label="Orders Today"
                    value={stats.today}
                />


                <AdminStatCard
                    label="This Week"
                    value={stats.week}
                />


                <AdminStatCard
                    label="This Month"
                    value={stats.month}
                />


                <AdminStatCard
                    label="This Year"
                    value={stats.year}
                />


                <AdminStatCard
                    label="Pending Orders"
                    value={stats.pending}
                />

            </div>


            {/* =========================
                Filters
            ========================= */}

            <AdminFilter

                search={search}

                onSearchChange={
                    handleSearch
                }

                searchPlaceholder={
                    "Search order number..."
                }


                status={
                    status || "ALL"
                }

                onStatusChange={
                    handleStatusChange
                }

                statusOptions={[

                    {
                        value: "ALL",
                        label: "All Status"
                    },

                    {
                        value: "PENDING",
                        label: "Pending"
                    },

                    {
                        value: "CONFIRMED",
                        label: "Confirmed"
                    },

                    {
                        value: "SHIPPED",
                        label: "Shipped"
                    },

                    {
                        value: "DELIVERED",
                        label: "Delivered"
                    },

                    {
                        value: "CANCELLED",
                        label: "Cancelled"
                    },

                    {
                        value: "RETURNED",
                        label: "Returned"
                    }

                ]}


                sort={sort}

                onSortChange={
                    handleSortChange
                }

                sortOptions={[

                    {
                        value: "newest",
                        label: "Newest"
                    },

                    {
                        value: "oldest",
                        label: "Oldest"
                    },

                    {
                        value: "highest",
                        label: "Highest Price"
                    },

                    {
                        value: "lowest",
                        label: "Lowest Price"
                    }

                ]}

            />


            {/* =========================
                Server Error
            ========================= */}

            {serverError && (

                <div className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                ">

                    {serverError}

                </div>

            )}


            {/* =========================
                Orders Table
            ========================= */}

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
            ">

                <div className="
                    overflow-x-auto
                ">

                    <table className="
                        admin-table
                    ">

                        <thead className="
                            border-b
                            border-gray-100
                            bg-gray-50
                        ">

                            <tr>

                                <th className="
                                    admin-table-header
                                ">

                                    Order

                                </th>


                                <th className="
                                    admin-table-header
                                ">

                                    Items

                                </th>


                                <th className="
                                    admin-table-header
                                ">

                                    Total

                                </th>


                                <th className="
                                    admin-table-header
                                ">

                                    Status

                                </th>


                                <th className="
                                    admin-table-header
                                ">

                                    Date

                                </th>


                                <th className="
                                    admin-table-header
                                    text-right
                                ">

                                    Action

                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-gray-500
                                        "
                                    >

                                        Loading orders...

                                    </td>

                                </tr>

                            ) : orders.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-gray-500
                                        "
                                    >

                                        No orders found.

                                    </td>

                                </tr>

                            ) : (

                                orders.map(
                                    order => (

                                        <tr
                                            key={
                                                order._id
                                            }
                                            className="
                                                border-b
                                                border-gray-100
                                                last:border-b-0
                                            "
                                        >

                                            {/* Order */}

                                            <td className="
                                                admin-table-cell
                                            ">

                                                <div>

                                                    <p className="
                                                        font-medium
                                                        text-gray-900
                                                    ">

                                                        {
                                                            order.orderNumber
                                                        }

                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-gray-500
                                                    ">

                                                        {
                                                            order.userId
                                                        }

                                                    </p>

                                                </div>

                                            </td>


                                            {/* Items */}

                                            <td className="
                                                admin-table-cell
                                            ">

                                                {
                                                    order.items?.reduce(
                                                        (
                                                            total,
                                                            item
                                                        ) =>
                                                            total +
                                                            item.quantity,
                                                        0
                                                    )
                                                }

                                            </td>


                                            {/* Total */}

                                            <td className="
                                                admin-table-cell
                                                font-medium
                                            ">

                                                ₹
                                                {
                                                    Number(
                                                        order.totalAmount ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )
                                                }

                                            </td>


                                            {/* Status */}

                                            <td className="
                                                admin-table-cell
                                            ">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        ${
                                                            order.status ===
                                                            "PENDING"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : ""
                                                        }
                                                        ${
                                                            order.status ===
                                                            "CONFIRMED"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : ""
                                                        }
                                                        ${
                                                            order.status ===
                                                            "SHIPPED"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : ""
                                                        }
                                                        ${
                                                            order.status ===
                                                            "DELIVERED"
                                                                ? "bg-green-100 text-green-700"
                                                                : ""
                                                        }
                                                        ${
                                                            order.status ===
                                                            "CANCELLED"
                                                                ? "bg-red-100 text-red-700"
                                                                : ""
                                                        }
                                                        ${
                                                            order.status ===
                                                            "RETURNED"
                                                                ? "bg-orange-100 text-orange-700"
                                                                : ""
                                                        }
                                                    `}
                                                >

                                                    {
                                                        order.status
                                                    }

                                                </span>

                                            </td>


                                            {/* Date */}

                                            <td className="
                                                admin-table-cell
                                            ">

                                                {
                                                    order.createdAt
                                                        ? new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                        : "-"
                                                }

                                            </td>


                                            {/* Action */}

                                            <td className="
                                                admin-table-cell
                                                text-right
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewOrder(
                                                            order._id
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-lg
                                                        px-3
                                                        py-2
                                                        text-sm
                                                        text-gray-700
                                                        hover:bg-gray-100
                                                    "
                                                >

                                                    <Eye
                                                        size={16}
                                                    />

                                                    View

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =========================
                    Pagination
                ========================= */}

                <AdminPagination

                    pagination={
                        pagination
                    }

                    loading={
                        loading
                    }

                    onPageChange={
                        changePage
                    }

                />

            </div>

        </div>

    );

};


export default AdminOrders;