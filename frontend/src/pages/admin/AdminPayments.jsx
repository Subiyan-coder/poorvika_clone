import {
    useCallback,
    useEffect,
    useState
} from "react";

import AdminStatCard from "../../components/admin/common/AdminStatCard";
import AdminFilter from "../../components/admin/common/AdminFilter";
import AdminPagination from "../../components/admin/common/AdminPagination";

import{
    getAdminPayments
} from "../../services/admin/adminPaymentService";

import {
    toastError
} from "../../utils/toast";


const PAYMENT_STATUS_LABELS = {

    PENDING: "Pending",

    PROCESSING: "Processing",

    PAID: "Paid",

    FAILED: "Failed",

    REFUNDED: "Refunded",

    PARTIALLY_REFUNDED:
        "Partially Refunded"

};


const PAYMENT_METHOD_LABELS = {

    COD: "COD",

    UPI: "UPI",

    CARD: "Card",

    NET_BANKING: "Net Banking"

};


const AdminPayments = () => {

    const [payments, setPayments] =
        useState([]);

    const [stats, setStats] =
        useState({

            paidToday: 0,

            pending: 0,

            failedToday: 0,

            refunded: 0

        });


    const [pagination, setPagination] =
        useState({

            currentPage: 1,

            totalPages: 1,

            totalPayments: 0,

            limit: 10,

            hasNextPage: false,

            hasPreviousPage: false

        });


    const [filters, setFilters] =
        useState({

            search: "",

            status: "",

            method: "",

            sort: "newest"

        });


    const [loading, setLoading] =
        useState(false);


    const fetchPayments =
        useCallback(
            async (
                page = 1
            ) => {

                try {

                    setLoading(true);


                    const response =
                        await getAdminPayments({

                            page,

                            limit:
                                pagination.limit,

                            search:
                                filters.search,

                            status:
                                filters.status,

                            method:
                                filters.method,

                            sort:
                                filters.sort

                        });


                    const data =
                        response.data || {};


                    setPayments(
                        data.payments || []
                    );


                    setPagination(
                        data.pagination || {

                            currentPage: page,

                            totalPages: 1,

                            totalPayments: 0,

                            limit: 10,

                            hasNextPage: false,

                            hasPreviousPage: false

                        }
                    );


                    setStats(
                        data.stats || {

                            paidToday: 0,

                            pending: 0,

                            failedToday: 0,

                            refunded: 0

                        }
                    );

                }
                catch (err) {

                    toastError(
                        err.response?.data?.message ||
                        "Failed to load payments"
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                filters,
                pagination.limit
            ]
        );


    useEffect(() => {

        fetchPayments(1);

    }, [fetchPayments]);


    const handleFilterChange =
        (name, value) => {

            setFilters(
                previous => ({

                    ...previous,

                    [name]: value

                })
            );

        };


    const handleSearch =
        (value) => {

            setFilters(
                previous => ({

                    ...previous,

                    search: value

                })
            );

        };


    const handlePageChange =
        (page) => {

            fetchPayments(page);

        };


    const formatAmount =
        (amount) => {

            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 2
                }
            ).format(amount || 0);

        };


    const formatDate =
        (date) => {

            if (!date) {
                return "-";
            }


            return new Date(
                date
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        };


    const getStatusClass =
        (status) => {

            switch (status) {

                case "PAID":

                    return "admin-status-active";


                case "REFUNDED":

                    return `
                        inline-flex
                        rounded-full
                        bg-blue-50
                        px-2.5 py-1
                        text-xs
                        font-medium
                        text-blue-700
                    `;


                case "PARTIALLY_REFUNDED":

                    return `
                        inline-flex
                        rounded-full
                        bg-orange-50
                        px-2.5 py-1
                        text-xs
                        font-medium
                        text-orange-700
                    `;


                case "FAILED":

                    return `
                        inline-flex
                        rounded-full
                        bg-red-50
                        px-2.5 py-1
                        text-xs
                        font-medium
                        text-red-700
                    `;


                case "PROCESSING":

                    return `
                        inline-flex
                        rounded-full
                        bg-yellow-50
                        px-2.5 py-1
                        text-xs
                        font-medium
                        text-yellow-700
                    `;


                default:

                    return "admin-status-inactive";

            }

        };


    return (

        <div className="space-y-6">

            {/* =========================
                Header
            ========================= */}

            <div>

                <h1 className="
                    text-2xl
                    font-semibold
                    text-gray-900
                ">
                    Payments
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-gray-500
                ">
                    View and monitor customer payments.
                </p>

            </div>


            {/* =========================
                Stats
            ========================= */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
            ">

                <AdminStatCard
                    title="Paid Today"
                    value={stats.paidToday}
                />

                <AdminStatCard
                    title="Pending"
                    value={stats.pending}
                />

                <AdminStatCard
                    title="Failed Today"
                    value={stats.failedToday}
                />

                <AdminStatCard
                    title="Refunded"
                    value={stats.refunded}
                />

            </div>


            {/* =========================
                Filters
            ========================= */}

            <AdminFilter>

                <div className="
                    grid
                    grid-cols-1
                    gap-3
                    md:grid-cols-2
                    lg:grid-cols-4
                ">

                    <input
                        type="text"
                        value={
                            filters.search
                        }
                        onChange={
                            event =>
                                handleSearch(
                                    event.target.value
                                )
                        }
                        placeholder="
                            Search order or transaction...
                        "
                        className="
                            admin-input
                        "
                    />


                    <select
                        value={
                            filters.status
                        }
                        onChange={
                            event =>
                                handleFilterChange(
                                    "status",
                                    event.target.value
                                )
                        }
                        className="
                            admin-select
                            w-full
                        "
                    >

                        <option value="">
                            All Statuses
                        </option>

                        {Object.entries(
                            PAYMENT_STATUS_LABELS
                        ).map(
                            ([value, label]) => (

                                <option
                                    key={value}
                                    value={value}
                                >
                                    {label}
                                </option>

                            )
                        )}

                    </select>


                    <select
                        value={
                            filters.method
                        }
                        onChange={
                            event =>
                                handleFilterChange(
                                    "method",
                                    event.target.value
                                )
                        }
                        className="
                            admin-select
                            w-full
                        "
                    >

                        <option value="">
                            All Methods
                        </option>

                        {Object.entries(
                            PAYMENT_METHOD_LABELS
                        ).map(
                            ([value, label]) => (

                                <option
                                    key={value}
                                    value={value}
                                >
                                    {label}
                                </option>

                            )
                        )}

                    </select>


                    <select
                        value={
                            filters.sort
                        }
                        onChange={
                            event =>
                                handleFilterChange(
                                    "sort",
                                    event.target.value
                                )
                        }
                        className="
                            admin-select
                            w-full
                        "
                    >

                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="highestAmount">
                            Highest Amount
                        </option>

                        <option value="lowestAmount">
                            Lowest Amount
                        </option>

                    </select>

                </div>

            </AdminFilter>


            {/* =========================
                Table
            ========================= */}

            <div className="
                admin-card
                overflow-hidden
            ">

                <div className="
                    overflow-x-auto
                ">

                    <table className="
                        admin-table
                    ">

                        <thead className="
                            border-b
                            border-gray-200
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
                                    Method
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Amount
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Refunded
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Status
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Transaction
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Gateway
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Paid At
                                </th>

                            </tr>

                        </thead>


                        <tbody className="
                            divide-y
                            divide-gray-100
                        ">

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        Loading payments...
                                    </td>

                                </tr>

                            ) : payments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        No payments found.
                                    </td>

                                </tr>

                            ) : (

                                payments.map(
                                    payment => (

                                        <tr
                                            key={
                                                payment._id
                                            }
                                            className="
                                                hover:bg-gray-50
                                            "
                                        >

                                            <td className="
                                                admin-table-cell
                                                font-medium
                                                text-gray-900
                                            ">
                                                {
                                                    payment
                                                        .orderId
                                                        ?.orderNumber ||
                                                    "-"
                                                }
                                            </td>


                                            <td className="
                                                admin-table-cell
                                            ">
                                                {
                                                    PAYMENT_METHOD_LABELS[
                                                        payment.method
                                                    ] ||
                                                    payment.method ||
                                                    "-"
                                                }
                                            </td>


                                            <td className="
                                                admin-table-cell
                                                font-medium
                                                text-gray-900
                                            ">
                                                {
                                                    formatAmount(
                                                        payment.amount
                                                    )
                                                }
                                            </td>


                                            <td className="
                                                admin-table-cell
                                            ">
                                                {
                                                    formatAmount(
                                                        payment.refundedAmount
                                                    )
                                                }
                                            </td>


                                            <td className="
                                                admin-table-cell
                                            ">

                                                <span
                                                    className={
                                                        getStatusClass(
                                                            payment.status
                                                        )
                                                    }
                                                >
                                                    {
                                                        PAYMENT_STATUS_LABELS[
                                                            payment.status
                                                        ] ||
                                                        payment.status ||
                                                        "-"
                                                    }
                                                </span>

                                            </td>


                                            <td className="
                                                admin-table-cell
                                            ">
                                                <span className="
                                                    block
                                                    max-w-[180px]
                                                    truncate
                                                ">
                                                    {
                                                        payment.transactionId ||
                                                        "-"
                                                    }
                                                </span>
                                            </td>


                                            <td className="
                                                admin-table-cell
                                            ">
                                                {
                                                    payment.paymentGateway ||
                                                    "-"
                                                }
                                            </td>


                                            <td className="
                                                admin-table-cell
                                            ">
                                                {
                                                    formatDate(
                                                        payment.paidAt
                                                    )
                                                }
                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {pagination.totalPages > 1 && (

                    <div className="
                        border-t
                        border-gray-200
                        px-6
                        py-4
                    ">

                        <AdminPagination
                            currentPage={
                                pagination.currentPage
                            }
                            totalPages={
                                pagination.totalPages
                            }
                            onPageChange={
                                handlePageChange
                            }
                        />

                    </div>

                )}

            </div>

        </div>

    );

};


export default AdminPayments;