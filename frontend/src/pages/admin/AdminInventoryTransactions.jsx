import { useCallback, useEffect, useState, Fragment } from "react";

import {
    History,
    ChevronDown,
    ChevronUp
} from "lucide-react";

import AdminFilter from "../../components/admin/common/AdminFilter";
import AdminPagination from "../../components/admin/common/AdminPagination";
import AdminStatCard from "../../components/admin/common/AdminStatCard";

import {
    getAdminInventoryTransactions
} from "../../services/admin/AdminInventoryTransactionService";
import { getAdmins } from "../../services/accountService";


const AdminInventoryTransactions = () => {

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [serverError, setServerError] =
        useState("");

    const [admins, setAdmins] =
        useState([]);

    // -------------------------
    // Filters
    // -------------------------

    const [search, setSearch] =
        useState("");

    const [source, setSource] =
        useState("ADMIN");

    const [type, setType] =
        useState("");

    const [sort, setSort] =
        useState("NEWEST");

    const [performedBy, setPerformedBy] =
    useState("");


    // -------------------------
    // Pagination
    // -------------------------

    const [pagination, setPagination] =
        useState({

            page: 1,

            limit: 20,

            totalItems: 0,

            totalPages: 1

        });


    // -------------------------
    // Stats
    // -------------------------

    const [stats, setStats] =
        useState({

            reservationsThisMonth: 0,

            salesThisMonth: 0,

            returnsThisMonth: 0,

            salesThisWeek: 0,

            salesToday: 0

        });


    // -------------------------
    // Expanded transaction
    // -------------------------

    const [expandedId, setExpandedId] =
        useState(null);


    // -------------------------
    // Filter options
    // -------------------------

    const sourceOptions = [

        {
            value: "ADMIN",
            label: "Admin"
        },

        {
            value: "ORDER",
            label: "Order"
        },

        {
            value: "ALL",
            label: "All"
        }

    ];


    const typeOptions = [

        {
            value: "",
            label: "All Types"
        },

        {
            value: "PURCHASE",
            label: "Purchase"
        },

        {
            value: "SALE",
            label: "Sale"
        },

        {
            value: "RETURN",
            label: "Return"
        },

        {
            value: "ADD",
            label: "Add"
        },

        {
            value: "REMOVE",
            label: "Remove"
        },

        {
            value: "DAMAGE",
            label: "Damage"
        },

        {
            value: "RESERVATION",
            label: "Reservation"
        },

        {
            value: "RELEASE",
            label: "Release"
        }

    ];


    const sortOptions = [

        {
            value: "NEWEST",
            label: "Newest"
        },

        {
            value: "OLDEST",
            label: "Oldest"
        }

    ];


    // -------------------------
    // Fetch Transactions
    // -------------------------

    const fetchTransactions =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setServerError("");


                    const result =
                        await getAdminInventoryTransactions({

                            page:
                                pagination.page,

                            limit:
                                pagination.limit,

                            search,

                            source,

                            type,

                            performedBy,

                            sort

                        });


                    setTransactions(
                        result.data || []
                    );


                    setPagination(
                        result.pagination || {
                            page: 1,
                            limit: 20,
                            totalItems: 0,
                            totalPages: 1
                        }
                    );


                    setStats(
                        result.stats || {
                            reservationsThisMonth: 0,
                            salesThisMonth: 0,
                            returnsThisMonth: 0,
                            salesThisWeek: 0,
                            salesToday: 0
                        }
                    );

                }
                catch (error) {

                    console.error(
                        "Failed to fetch transactions:",
                        error
                    );


                    setServerError(
                        error.response?.data?.message ||
                        "Failed to load transaction history."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                pagination.page,
                pagination.limit,
                search,
                source,
                type,
                performedBy,
                sort
            ]
        );


    useEffect(() => {

        fetchTransactions();

    }, [fetchTransactions]);

    // Fetch Admins

    useEffect(() => {

        const fetchAdmins = async () => {

            try {

                const result =
                    await getAdmins();

                setAdmins(
                    Array.isArray(result.data)
                        ? result.data
                        : []
                );

            }
            catch (error) {

                console.error(
                    "Failed to fetch admins:",
                    error
                );

                setAdmins([]);

            }

        };

        fetchAdmins();

    }, []);


    // -------------------------
    // Filter handlers
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


    const handleSourceChange =
        (value) => {

            setSource(value);

            setPagination(
                previous => ({
                    ...previous,
                    page: 1
                })
            );

            setExpandedId(null);

        };


    const handleTypeChange =
        (value) => {

            setType(value);

            setPagination(
                previous => ({
                    ...previous,
                    page: 1
                })
            );

        };

    const handlePerformedByChange =
        (value) => {

            setPerformedBy(value);

            setPagination(
                previous => ({
                    ...previous,
                    page: 1
                })
            );

            setExpandedId(null);

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


    const handlePageChange =
        (page) => {

            setPagination(
                previous => ({
                    ...previous,
                    page
                })
            );

            setExpandedId(null);

        };


    // -------------------------
    // Helpers
    // -------------------------

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


    const getTypeLabel =
        (transactionType) => {

            return transactionType
                .replaceAll("_", " ")
                .toLowerCase()
                .replace(
                    /\b\w/g,
                    character =>
                        character.toUpperCase()
                );

        };


    const getTypeClass =
        (transactionType) => {

            if (
                transactionType === "ADD" ||
                transactionType === "PURCHASE" ||
                transactionType === "RETURN" ||
                transactionType === "RELEASE"
            ) {

                return "admin-status-active";

            }


            if (
                transactionType === "REMOVE" ||
                transactionType === "DAMAGE"
            ) {

                return "admin-status-inactive";

            }


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

        };


    const getProduct =
        (transaction) =>
            transaction.productVariantId?.productId;


    const getVariant =
        (transaction) =>
            transaction.productVariantId;


    const toggleExpanded =
        (transactionId) => {

            setExpandedId(
                previous =>
                    previous === transactionId
                        ? null
                        : transactionId
            );

        };


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

                        <History
                            size={20}
                        />

                    </div>


                    <div>

                        <h1 className="
                            text-2xl
                            font-semibold
                            text-gray-900
                        ">
                            Transaction History
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            Track inventory movements
                            and order activity.
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
                lg:grid-cols-5
            ">

                <AdminStatCard
                    label="Reservations This Month"
                    value={
                        stats.reservationsThisMonth
                    }
                />

                <AdminStatCard
                    label="Sales This Month"
                    value={
                        stats.salesThisMonth
                    }
                />

                <AdminStatCard
                    label="Returns This Month"
                    value={
                        stats.returnsThisMonth
                    }
                />

                <AdminStatCard
                    label="Sales This Week"
                    value={
                        stats.salesThisWeek
                    }
                />

                <AdminStatCard
                    label="Sales Today"
                    value={
                        stats.salesToday
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
                    Search admin, SKU, product, brand or color...
                "

                status={source}

                onStatusChange={
                    handleSourceChange
                }

                statusOptions={
                    sourceOptions
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
                Type filter
            ------------------------- */}

            <div className="
                flex
                flex-wrap
                items-center
                gap-3
            ">

                {/* Transaction Type */}

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <label className="
                        text-sm
                        font-medium
                        text-gray-700
                    ">
                        Transaction Type
                    </label>

                    <select
                        value={type}
                        onChange={event =>
                            handleTypeChange(
                                event.target.value
                            )
                        }
                        className="admin-select"
                    >

                        {typeOptions.map(
                            option => (

                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* Admin */}

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <label className="
                        text-sm
                        font-medium
                        text-gray-700
                    ">
                        Admin
                    </label>

                    <select
                        value={performedBy}
                        onChange={event =>
                            handlePerformedByChange(
                                event.target.value
                            )
                        }
                        className="admin-select"
                    >

                        <option value="">
                            All Admins
                        </option>

                        {admins.map(admin => (

                            <option
                                key={admin._id}
                                value={admin._id}
                            >
                                {admin.name}
                            </option>

                        ))}

                    </select>

                </div>

            </div>


            {/* -------------------------
                Error
            ------------------------- */}

            {serverError && (

                <div className="admin-error">

                    {serverError}

                </div>

            )}


            {/* -------------------------
                Table
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
                                    Date
                                </th>


                                <th className="admin-table-header">
                                    Product
                                </th>

                                <th className="admin-table-header">
                                    Variant
                                </th>

                                <th className="admin-table-header">
                                    Type
                                </th>

                                <th className="admin-table-header">
                                    Quantity
                                </th>

                                <th className="admin-table-header">
                                    Performed By
                                </th>

                                <th className="admin-table-header">
                                    Reference
                                </th>

                                <th className="admin-table-header">
                                    Details
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading && (

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
                                        Loading transactions...
                                    </td>

                                </tr>

                            )}


                            {!loading &&
                                transactions.length === 0 && (

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
                                            No transactions found.
                                        </td>

                                    </tr>

                                )}


                            {!loading &&
                                transactions.map(
                                    transaction => {

                                        const product =
                                            getProduct(
                                                transaction
                                            );

                                        const variant =
                                            getVariant(
                                                transaction
                                            );

                                        const expanded =
                                            expandedId ===
                                            transaction._id;


                                        return (

                                            <Fragment key={transaction._id}>

                                                <tr
                                                    key={
                                                        transaction._id
                                                    }
                                                    className="
                                                        border-b
                                                        border-gray-100
                                                    "
                                                >

                                                    <td className="admin-table-cell">
                                                        {formatDate(
                                                            transaction.createdAt
                                                        )}
                                                    </td>


                                                    <td className="admin-table-cell">

                                                        <div>

                                                            <p className="
                                                                font-medium
                                                                text-gray-900
                                                            ">
                                                                {product?.name ||
                                                                    "-"}
                                                            </p>

                                                            <p className="
                                                                mt-1
                                                                text-xs
                                                                text-gray-500
                                                            ">
                                                                {product?.brand ||
                                                                    "-"}
                                                            </p>

                                                        </div>

                                                    </td>


                                                    <td className="admin-table-cell">

                                                        <div>

                                                            <p>
                                                                {variant?.color ||
                                                                    "-"}
                                                            </p>

                                                            {product?.primarySpecification && (

                                                                <p className="
                                                                    mt-1
                                                                    text-xs
                                                                    text-gray-500
                                                                ">
                                                                    {
                                                                        product
                                                                            .primarySpecification
                                                                            .name
                                                                    }
                                                                    {" : "}
                                                                    {
                                                                        product
                                                                            .primarySpecification
                                                                            .value
                                                                    }
                                                                </p>

                                                            )}

                                                        </div>

                                                    </td>


                                                    <td className="admin-table-cell">

                                                        <span
                                                            className={
                                                                getTypeClass(
                                                                    transaction.type
                                                                )
                                                            }
                                                        >
                                                            {getTypeLabel(
                                                                transaction.type
                                                            )}
                                                        </span>

                                                    </td>


                                                    <td className="
                                                        admin-table-cell
                                                        font-medium
                                                    ">
                                                        {transaction.quantity}
                                                    </td>


                                                    <td className="admin-table-cell">

                                                        <div>

                                                            <p className="
                                                                font-medium
                                                                text-gray-900
                                                            ">
                                                                {
                                                                    transaction
                                                                        .performedBy
                                                                        ?.name ||
                                                                    "-"
                                                                }
                                                            </p>

                                                            <p className="
                                                                mt-1
                                                                text-xs
                                                                text-gray-500
                                                            ">
                                                                {
                                                                    transaction
                                                                        .performedBy
                                                                        ?.role ||
                                                                    "-"
                                                                }
                                                            </p>

                                                        </div>

                                                    </td>


                                                    <td className="admin-table-cell">

                                                        {transaction.referenceId
                                                            ? (
                                                                <span className="
                                                                    text-xs
                                                                    font-medium
                                                                    text-gray-700
                                                                ">
                                                                    Order
                                                                </span>
                                                            )
                                                            : (
                                                                <span className="
                                                                    text-xs
                                                                    text-gray-500
                                                                ">
                                                                    Admin
                                                                </span>
                                                            )}

                                                    </td>


                                                    <td className="admin-table-cell">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleExpanded(
                                                                    transaction._id
                                                                )
                                                            }
                                                            className="
                                                                admin-button-ghost
                                                                h-9
                                                                px-3
                                                            "
                                                        >

                                                            {expanded
                                                                ? (
                                                                    <>
                                                                        <ChevronUp
                                                                            size={16}
                                                                        />

                                                                        <span className="ml-1">
                                                                            Less
                                                                        </span>
                                                                    </>
                                                                )
                                                                : (
                                                                    <>
                                                                        <ChevronDown
                                                                            size={16}
                                                                        />

                                                                        <span className="ml-1">
                                                                            More
                                                                        </span>
                                                                    </>
                                                                )}

                                                        </button>

                                                    </td>

                                                </tr>

                                                {/* SKU Row */}

                                                <tr
                                                    className="
                                                        border-b
                                                        border-gray-100
                                                        bg-white
                                                    "
                                                >

                                                    <td
                                                        colSpan="8"
                                                        className="
                                                            px-6
                                                            py-2
                                                            text-xs
                                                            text-gray-500
                                                        "
                                                    >

                                                        <span className="
                                                            font-medium
                                                            text-gray-700
                                                        ">
                                                            SKU:
                                                        </span>

                                                        <span className="
                                                            ml-1
                                                            break-all
                                                        ">
                                                            {variant?.sku || "-"}
                                                        </span>

                                                    </td>

                                                </tr>


                                                {/* Expanded Details */}


                                                {expanded && (

                                                    <tr
                                                        key={`${transaction._id}-details`}
                                                        className="
                                                            border-b
                                                            border-gray-200
                                                            bg-gray-50
                                                        "
                                                    >

                                                        <td
                                                            colSpan="8"
                                                            className="
                                                                px-6
                                                                py-5
                                                            "
                                                        >

                                                            <div className="
                                                                grid
                                                                gap-5
                                                                md:grid-cols-3
                                                            ">


                                                                {/* Product */}

                                                                <div>

                                                                    <p className="
                                                                        text-xs
                                                                        font-medium
                                                                        uppercase
                                                                        tracking-wide
                                                                        text-gray-500
                                                                    ">
                                                                        Product
                                                                    </p>

                                                                    <p className="
                                                                        mt-2
                                                                        text-sm
                                                                        font-medium
                                                                        text-gray-900
                                                                    ">
                                                                        {
                                                                            product?.name ||
                                                                            "-"
                                                                        }
                                                                    </p>

                                                                    <p className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-gray-500
                                                                    ">
                                                                        SKU: {
                                                                            product?.sku ||
                                                                            "-"
                                                                        }
                                                                    </p>

                                                                    <p className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-gray-500
                                                                    ">
                                                                        Slug: {
                                                                            product?.slug ||
                                                                            "-"
                                                                        }
                                                                    </p>

                                                                    <p className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-gray-500
                                                                    ">
                                                                        Category: {
                                                                            product
                                                                                ?.categoryId
                                                                                ?.name ||
                                                                            "-"
                                                                        }
                                                                    </p>

                                                                </div>


                                                                {/* Specifications */}

                                                                <div>

                                                                    <p className="
                                                                        text-xs
                                                                        font-medium
                                                                        uppercase
                                                                        tracking-wide
                                                                        text-gray-500
                                                                    ">
                                                                        Specifications
                                                                    </p>


                                                                    <p className="
                                                                        mt-2
                                                                        text-sm
                                                                        text-gray-700
                                                                    ">

                                                                        {
                                                                            product
                                                                                ?.primarySpecification
                                                                                ?.name ||
                                                                            "-"
                                                                        }

                                                                        {" : "}

                                                                        {
                                                                            product
                                                                                ?.primarySpecification
                                                                                ?.value ||
                                                                            "-"
                                                                        }

                                                                    </p>


                                                                    <p className="
                                                                        mt-1
                                                                        text-sm
                                                                        text-gray-700
                                                                    ">

                                                                        {
                                                                            product
                                                                                ?.secondarySpecification
                                                                                ?.name ||
                                                                            "-"
                                                                        }

                                                                        {" : "}

                                                                        {
                                                                            product
                                                                                ?.secondarySpecification
                                                                                ?.value ||
                                                                            "-"
                                                                        }

                                                                    </p>


                                                                    <p className="
                                                                        mt-1
                                                                        text-sm
                                                                        text-gray-700
                                                                    ">

                                                                        Color
                                                                        {" : "}
                                                                        {
                                                                            variant?.color ||
                                                                            "-"
                                                                        }

                                                                    </p>

                                                                </div>


                                                                {/* Transaction */}

                                                                <div>

                                                                    <p className="
                                                                        text-xs
                                                                        font-medium
                                                                        uppercase
                                                                        tracking-wide
                                                                        text-gray-500
                                                                    ">
                                                                        Transaction
                                                                    </p>


                                                                    <p className="
                                                                        mt-2
                                                                        text-sm
                                                                        text-gray-700
                                                                    ">
                                                                        Type: {
                                                                            getTypeLabel(
                                                                                transaction.type
                                                                            )
                                                                        }
                                                                    </p>


                                                                    <p className="
                                                                        mt-1
                                                                        text-sm
                                                                        text-gray-700
                                                                    ">
                                                                        Quantity: {
                                                                            transaction.quantity
                                                                        }
                                                                    </p>


                                                                    <p className="
                                                                        mt-1
                                                                        text-sm
                                                                        text-gray-700
                                                                    ">
                                                                        Date: {
                                                                            formatDate(
                                                                                transaction.createdAt
                                                                            )
                                                                        }
                                                                    </p>


                                                                    <p className="
                                                                        mt-1
                                                                        break-all
                                                                        text-xs
                                                                        text-gray-500
                                                                    ">
                                                                        Reference: {
                                                                            transaction.referenceId ||
                                                                            "-"
                                                                        }
                                                                    </p>


                                                                    {transaction.note && (

                                                                        <p className="
                                                                            mt-2
                                                                            text-sm
                                                                            text-gray-700
                                                                        ">
                                                                            Note: {
                                                                                transaction.note
                                                                            }
                                                                        </p>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )}

                                            </Fragment>

                                        );

                                    }
                                )}

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

        </div>

    );

};


export default AdminInventoryTransactions;