import { useEffect, useMemo, useState, Fragment } from "react";

import {
    getAdminInventory,
    adjustInventory,
    updateInventoryAvailability
} from "../../services/admin/AdminInventoryService";

import AdminModal from "../../components/admin/common/AdminModal";
import AdminStatCard from "../../components/admin/common/AdminStatCard";

import {
    toastSuccess,
    toastError
} from "../../utils/toast";


const AdminInventory = () => {

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [expandedProducts, setExpandedProducts] =
        useState({});

    const [selectedVariant, setSelectedVariant] =
        useState(null);

    const [saving, setSaving] = useState(false);


    const [adjustment, setAdjustment] = useState({
        type: "ADD",
        quantity: "",
        note: ""
    });


    const loadInventory = async () => {

        try {

            setLoading(true);

            const response =
                await getAdminInventory();

            setInventory(
                response.data || []
            );

        }
        catch (err) {

            toastError(
                err.response?.data?.message ||
                "Failed to load inventory"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadInventory();

    }, []);


    const groupedProducts = useMemo(() => {

        const searchTerm =
            search.trim().toLowerCase();

        const filteredInventory =
            inventory.filter(item => {

                const variant =
                    item.productVariantId;

                const product =
                    variant?.productId;

                if (!product || !variant) {
                    return false;
                }

                if (!searchTerm) {
                    return true;
                }

                return (
                    product.name
                        ?.toLowerCase()
                        .includes(searchTerm)

                    ||

                    product.slug
                        ?.toLowerCase()
                        .includes(searchTerm)

                    ||

                    product.sku
                        ?.toLowerCase()
                        .includes(searchTerm)

                    ||

                    variant.sku
                        ?.toLowerCase()
                        .includes(searchTerm)

                    ||

                    variant.color
                        ?.toLowerCase()
                        .includes(searchTerm)

                    ||

                    product.brand
                        ?.toLowerCase()
                        .includes(searchTerm)
                );
            });


        const groups = {};


        filteredInventory.forEach(item => {

            const variant =
                item.productVariantId;

            const product =
                variant.productId;

            const productId =
                product._id;


            if (!groups[productId]) {

                groups[productId] = {

                    product,

                    variants: [],

                    totalQuantity: 0,

                    totalReservedQuantity: 0

                };

            }


            groups[productId].variants.push(item);

            groups[productId].totalQuantity +=
                item.quantity || 0;

            groups[productId].totalReservedQuantity +=
                item.reservedQuantity || 0;

        });


        return Object.values(groups);

    }, [inventory, search]);


    const statistics = useMemo(() => {

        const totalVariants =
            inventory.length;


        const totalStock =
            inventory.reduce(
                (total, item) =>
                    total + (item.quantity || 0),
                0
            );


        const lowStock =
            inventory.filter(item => {

                const quantity =
                    item.quantity || 0;

                const threshold =
                    item.lowStockThreshold || 0;

                return (
                    quantity > 0 &&
                    quantity <= threshold
                );

            }).length;


        const outOfStock =
            inventory.filter(
                item =>
                    (item.quantity || 0) === 0
            ).length;


        return {
            totalVariants,
            totalStock,
            lowStock,
            outOfStock
        };

    }, [inventory]);


    const toggleProduct = productId => {

        setExpandedProducts(
            previous => ({

                ...previous,

                [productId]:
                    !previous[productId]

            })
        );

    };


    const openManage = variant => {

        setSelectedVariant(variant);

        setAdjustment({
            type: "ADD",
            quantity: "",
            note: ""
        });

    };


    const closeManage = () => {

        if (saving) {
            return;
        }

        setSelectedVariant(null);

    };


    const handleAdjustment = async event => {

        event.preventDefault();


        const quantity =
            Number(adjustment.quantity);


        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            toastError(
                "Quantity must be at least 1"
            );

            return;
        }


        try {

            setSaving(true);


            const response =
                await adjustInventory(
                    selectedVariant.productVariantId._id,
                    {
                        quantity,
                        type:
                            adjustment.type,
                        note:
                            adjustment.note.trim()
                    }
                );


            toastSuccess(
                "Inventory adjusted successfully"
            );


            setInventory(previous =>
                previous.map(item => {

                    if (
                        item.productVariantId?._id !==
                        selectedVariant.productVariantId?._id
                    ) {
                        return item;
                    }


                    return {

                        ...item,

                        ...response.data,

                        productVariantId:
                            item.productVariantId

                    };

                })
            );


            setSelectedVariant(previous => {

                if (!previous) {
                    return null;
                }


                return {

                    ...previous,

                    ...response.data,

                    productVariantId:
                        previous.productVariantId

                };

            });


            setAdjustment({
                type: "ADD",
                quantity: "",
                note: ""
            });

        }
        catch (err) {

            toastError(
                err.response?.data?.message ||
                "Failed to adjust inventory"
            );

        }
        finally {

            setSaving(false);

        }

    };


    const handleAvailability = async () => {

        if (!selectedVariant) {
            return;
        }


        try {

            setSaving(true);


            const newStatus =
                !selectedVariant.isAvailable;


            const response =
                await updateInventoryAvailability(
                    selectedVariant.productVariantId._id,
                    newStatus
                );


            toastSuccess(
                "Inventory availability updated"
            );


            setInventory(previous =>
                previous.map(item => {

                    if (
                        item.productVariantId?._id !==
                        selectedVariant.productVariantId?._id
                    ) {
                        return item;
                    }


                    return {

                        ...item,

                        ...response.data,

                        productVariantId:
                            item.productVariantId

                    };

                })
            );


            setSelectedVariant(previous => ({

                ...previous,

                ...response.data,

                productVariantId:
                    previous.productVariantId

            }));

        }
        catch (err) {

            toastError(
                err.response?.data?.message ||
                "Failed to update availability"
            );

        }
        finally {

            setSaving(false);

        }

    };


    const getStockStatus = item => {

        const quantity =
            item.quantity || 0;

        const threshold =
            item.lowStockThreshold || 0;


        if (quantity === 0) {

            return {
                label: "Out of stock",
                className:
                    "admin-status-inactive"
            };

        }


        if (quantity <= threshold) {

            return {
                label: "Low stock",
                className:
                    "inline-flex rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700"
            };

        }


        return {
            label: "In stock",
            className:
                "admin-status-active"
        };

    };


    return (

        <div className="space-y-6">

            {/* Header */}

            <div>

                <h1 className="
                    text-2xl
                    font-semibold
                    text-gray-900
                ">
                    Inventory
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-gray-500
                ">
                    Manage stock and availability
                    for product variants.
                </p>

            </div>


            {/* Statistics */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
            ">

                <AdminStatCard
                    label="Total Variants"
                    value={
                        statistics.totalVariants
                    }
                />

                <AdminStatCard
                    label="Total Stock"
                    value={
                        statistics.totalStock
                    }
                />

                <AdminStatCard
                    label="Low Stock"
                    value={
                        statistics.lowStock
                    }
                />

                <AdminStatCard
                    label="Out of Stock"
                    value={
                        statistics.outOfStock
                    }
                />

            </div>


            {/* Search */}

            <div className="
                admin-card
                p-4
            ">

                <input
                    type="text"
                    value={search}
                    onChange={event =>
                        setSearch(
                            event.target.value
                        )
                    }
                    placeholder="Search by SKU, product or color..."
                    className="admin-input"
                />

            </div>


            {/* Inventory */}

            <div className="space-y-4">

                {loading ? (

                    <div className="
                        admin-card
                        p-8
                        text-center
                        text-sm
                        text-gray-500
                    ">
                        Loading inventory...
                    </div>

                ) : groupedProducts.length === 0 ? (

                    <div className="
                        admin-card
                        p-8
                        text-center
                        text-sm
                        text-gray-500
                    ">
                        No inventory found.
                    </div>

                ) : (

                    groupedProducts.map(
                        ({ 
                            product,
                            variants,
                            totalQuantity,
                            totalReservedQuantity
                        }) => {

                            const expanded =
                                expandedProducts[
                                    product._id
                                ];


                            return (

                                <div
                                    key={product._id}
                                    className="admin-card overflow-hidden"
                                >

                                    {/* Product header */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleProduct(
                                                product._id
                                            )
                                        }
                                        className="
                                            w-full
                                            px-6
                                            py-5
                                            text-left
                                            hover:bg-gray-50
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-6
                                        ">

                                            <div className="min-w-0">

                                                {/* Product SKU */}

                                                <p className="
                                                    whitespace-nowrap
                                                    text-xs
                                                    font-medium
                                                    text-gray-500
                                                ">
                                                    SKU: {product.sku}
                                                </p>


                                                {/* Product Slug */}

                                                <p className="
                                                    mt-1
                                                    whitespace-nowrap
                                                    overflow-hidden
                                                    text-ellipsis
                                                    text-xs
                                                    text-gray-400
                                                ">
                                                    Slug: {product.slug}
                                                </p>


                                                {/* Product name */}

                                                <h2 className="
                                                    mt-3
                                                    text-base
                                                    font-semibold
                                                    text-gray-900
                                                ">
                                                    {product.name}
                                                </h2>


                                                {/* Brand */}

                                                <p className="
                                                    mt-1
                                                    text-sm
                                                    text-gray-500
                                                ">
                                                    {product.brand}
                                                </p>


                                                {/* Inventory summary */}

                                                <div className="
                                                    mt-4
                                                    flex
                                                    flex-wrap
                                                    gap-x-6
                                                    gap-y-2
                                                    text-sm
                                                ">

                                                    <span>
                                                        <span className="text-gray-500">
                                                            Quantity:
                                                        </span>{" "}
                                                        <span className="
                                                            font-medium
                                                            text-gray-900
                                                        ">
                                                            {totalQuantity}
                                                        </span>
                                                    </span>


                                                    <span>
                                                        <span className="text-gray-500">
                                                            Reserved:
                                                        </span>{" "}
                                                        <span className="
                                                            font-medium
                                                            text-gray-900
                                                        ">
                                                            {totalReservedQuantity}
                                                        </span>
                                                    </span>


                                                    <span>
                                                        <span className="text-gray-500">
                                                            Variants:
                                                        </span>{" "}
                                                        <span className="
                                                            font-medium
                                                            text-gray-900
                                                        ">
                                                            {variants.length}
                                                        </span>
                                                    </span>

                                                </div>

                                            </div>


                                            {/* Expand control */}

                                            <div className="
                                                shrink-0
                                                pt-1
                                            ">

                                                <span className="
                                                    inline-flex
                                                    items-center
                                                    rounded-xl
                                                    border
                                                    border-gray-300
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    font-medium
                                                    text-gray-700
                                                ">
                                                    {expanded
                                                        ? "Hide Variants"
                                                        : "Show Variants"}
                                                </span>

                                            </div>

                                        </div>

                                    </button>


                                    {/* Variants */}

                                    {expanded && (

                                        <div className="
                                            overflow-x-auto
                                            border-t
                                            border-gray-200
                                        ">

                                            <table className="admin-table">

                                                <thead>

                                                    <tr>

                                                        <th className="admin-table-header">
                                                            Color
                                                        </th>

                                                        <th className="admin-table-header">
                                                            Primary
                                                        </th>

                                                        <th className="admin-table-header">
                                                            Secondary
                                                        </th>

                                                        <th className="admin-table-header">
                                                            Price
                                                        </th>

                                                        <th className="admin-table-header">
                                                            Quantity
                                                        </th>

                                                        <th className="admin-table-header">
                                                            Reserved
                                                        </th>

                                                        <th className="admin-table-header">
                                                            Available 
                                                        </th>

                                                        <th className="admin-table-header">
                                                            Low AT
                                                        </th>

                                                        <th className="admin-table-header">
                                                            Status
                                                        </th>

                                                    </tr>

                                                </thead>


                                                <tbody>

                                                    {variants.map(
                                                        item => {

                                                            const variant =
                                                                item.productVariantId;

                                                            const stockStatus =
                                                                getStockStatus(
                                                                    item
                                                                );


                                                            return (
                                                                <Fragment key={item._id}>
                                                                    <tr
                                                                        key={
                                                                            item._id
                                                                        }
                                                                        className="
                                                                            border-t
                                                                            border-gray-100
                                                                        "
                                                                    >

                                                                        <td className="admin-table-cell whitespace-nowrap">
                                                                            {variant.color || "—"}
                                                                        </td>

                                                                        <td className="admin-table-cell whitespace-nowrap">
                                                                            {variant.primarySpecification
                                                                                ? `${variant.primarySpecification.name}: ${variant.primarySpecification.value}`
                                                                                : "—"}
                                                                        </td>

                                                                        <td className="admin-table-cell whitespace-nowrap">
                                                                            {variant.secondarySpecification?.name
                                                                                ? `${variant.secondarySpecification.name}: ${variant.secondarySpecification.value}`
                                                                                : "—"}
                                                                        </td>

                                                                        <td className="admin-table-cell whitespace-nowrap">
                                                                            ₹{variant.discountPrice || variant.price}
                                                                        </td>

                                                                        <td className="admin-table-cell">
                                                                            {item.quantity + item.reservedQuantity}
                                                                        </td>

                                                                        <td className="admin-table-cell">
                                                                            {item.reservedQuantity}
                                                                        </td>

                                                                        <td className="admin-table-cell">
                                                                            {item.quantity}
                                                                        </td>


                                                                        <td className="admin-table-cell">
                                                                            {item.lowStockThreshold}
                                                                        </td>



                                                                        <td className="admin-table-cell">

                                                                            <span
                                                                                className={
                                                                                    stockStatus.className
                                                                                }
                                                                            >
                                                                                {
                                                                                    stockStatus.label
                                                                                }
                                                                            </span>

                                                                        </td>


                                                                        <td className="admin-table-cell">

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    openManage(
                                                                                        item
                                                                                    )
                                                                                }
                                                                                className="admin-button-secondary"
                                                                            >
                                                                                Manage
                                                                            </button>

                                                                        </td>

                                                                    </tr>

                                                                    <tr>
                                                                        <td
                                                                            colSpan={8}
                                                                            className="
                                                                                border-b
                                                                                border-gray-200
                                                                                px-6
                                                                                pb-4
                                                                                text-sm
                                                                                text-gray-500
                                                                            "
                                                                        >
                                                                            <span className="font-medium text-gray-600">
                                                                                SKU:
                                                                            </span>{" "}
                                                                            <span className="break-all">
                                                                                {variant.sku}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </Fragment>

                                                            );

                                                        }
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    )}

                                </div>

                            );

                        }
                    )

                )}

            </div>


            {/* Manage Inventory Modal */}

            {selectedVariant && (

                <AdminModal
                    open={Boolean(
                        selectedVariant
                    )}
                    onClose={closeManage}
                    title="Manage Inventory"
                >

                    <div className="space-y-6">

                        {/* Variant details */}

                        <div className="
                            rounded-xl
                            bg-gray-50
                            p-4
                        ">

                            <p className="
                                text-sm
                                font-medium
                                text-gray-900
                            ">
                                {
                                    selectedVariant
                                        .productVariantId
                                        ?.productId
                                        ?.name
                                }
                            </p>


                            <div className="
                                mt-3
                                grid
                                grid-cols-2
                                gap-4
                                text-sm
                            ">

                                <div>

                                    <p className="text-gray-500">
                                        SKU
                                    </p>

                                    <p className="
                                        mt-1
                                        font-medium
                                        text-gray-900
                                    ">
                                        {
                                            selectedVariant
                                                .productVariantId
                                                ?.sku
                                        }
                                    </p>

                                </div>


                                <div>

                                    <p className="text-gray-500">
                                        Color
                                    </p>

                                    <p className="
                                        mt-1
                                        font-medium
                                        text-gray-900
                                    ">
                                        {
                                            selectedVariant
                                                .productVariantId
                                                ?.color || "—"
                                        }
                                    </p>

                                    <div>
                                        <p className="text-gray-500">
                                            Primary
                                        </p>

                                        <p className="
                                            mt-1
                                            font-medium
                                            text-gray-900
                                        ">
                                            {selectedVariant.productVariantId
                                                ?.primarySpecification?.name || "—"}
                                            {": "}
                                            {selectedVariant.productVariantId
                                                ?.primarySpecification?.value || "—"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-gray-500">
                                            Secondary
                                        </p>

                                        <p className="
                                            mt-1
                                            font-medium
                                            text-gray-900
                                        ">
                                            {selectedVariant.productVariantId
                                                ?.secondarySpecification?.name || "—"}
                                            {": "}
                                            {selectedVariant.productVariantId
                                                ?.secondarySpecification?.value || "—"}
                                        </p>
                                    </div>

                                </div>


                                <div>

                                    <p className="text-gray-500">
                                        Current Stock
                                    </p>

                                    <p className="
                                        mt-1
                                        font-medium
                                        text-gray-900
                                    ">
                                        {
                                            selectedVariant
                                                .quantity
                                        }
                                    </p>

                                </div>


                                <div>

                                    <p className="text-gray-500">
                                        Low Stock At
                                    </p>

                                    <p className="
                                        mt-1
                                        font-medium
                                        text-gray-900
                                    ">
                                        {
                                            selectedVariant
                                                .lowStockThreshold
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Adjustment */}

                        <form
                            onSubmit={
                                handleAdjustment
                            }
                            className="space-y-4"
                        >

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    Transaction Type
                                </label>

                                <select
                                    value={
                                        adjustment.type
                                    }
                                    onChange={event =>
                                        setAdjustment(
                                            previous => ({
                                                ...previous,
                                                type:
                                                    event.target.value
                                            })
                                        )
                                    }
                                    disabled={saving}
                                    className="admin-select w-full"
                                >

                                    <option value="ADD">
                                        Add Stock
                                    </option>

                                    <option value="REMOVE">
                                        Remove Stock
                                    </option>

                                    <option value="DAMAGE">
                                        Damaged Stock
                                    </option>

                                </select>

                            </div>


                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={
                                        adjustment.quantity
                                    }
                                    onChange={event =>
                                        setAdjustment(
                                            previous => ({
                                                ...previous,
                                                quantity:
                                                    event.target.value
                                            })
                                        )
                                    }
                                    disabled={saving}
                                    placeholder="Enter quantity"
                                    className="admin-input"
                                />

                            </div>


                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    Note
                                </label>

                                <textarea
                                    value={
                                        adjustment.note
                                    }
                                    onChange={event =>
                                        setAdjustment(
                                            previous => ({
                                                ...previous,
                                                note:
                                                    event.target.value
                                            })
                                        )
                                    }
                                    disabled={saving}
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Optional note"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        focus:border-gray-900
                                        focus:ring-2
                                        focus:ring-gray-100
                                    "
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={saving}
                                className="admin-button-primary w-full"
                            >
                                {saving
                                    ? "Updating..."
                                    : "Adjust Stock"}
                            </button>

                        </form>


                        {/* Availability */}

                        <div className="
                            border-t
                            border-gray-200
                            pt-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            ">

                                <div>

                                    <p className="
                                        text-sm
                                        font-medium
                                        text-gray-900
                                    ">
                                        Availability
                                    </p>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-gray-500
                                    ">
                                        Control whether this
                                        variant can be sold.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleAvailability
                                    }
                                    disabled={saving}
                                    className={
                                        selectedVariant
                                            .isAvailable
                                            ? "admin-button-secondary"
                                            : "admin-button-primary"
                                    }
                                >
                                    {selectedVariant
                                        .isAvailable
                                        ? "Mark Unavailable"
                                        : "Mark Available"}
                                </button>

                            </div>

                        </div>

                    </div>

                </AdminModal>

            )}

        </div>

    );

};


export default AdminInventory;