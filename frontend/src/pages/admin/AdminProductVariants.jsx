import {
    useCallback,
    useEffect,
    useState,
    Fragment
} from "react";

import {
    toastSuccess,
    toastError
} from "../../utils/toast";

import ProductVariantForm
    from "../../components/admin/product/ProductVariantForm";

import AdminPageHeader
    from "./common/AdminPageHeader";

import AdminFilter
    from "../../components/admin/common/AdminFilter";

import AdminStatCard
    from "../../components/admin/common/AdminStatCard";

import AdminPagination
    from "../../components/admin/common/AdminPagination";

import AdminModal
    from "../../components/admin/common/AdminModal";

import {
    getAdminProductVariants,
    createProductVariant,
    updateProductVariant,
    updateProductVariantStatus,
    deleteProductVariant,
    addProductVariantImages,
    deleteProductVariantImage
} from "../../services/admin/adminProductVariant";

import {
    getAdminProducts
} from "../../services/admin/adminProductService";


const AdminProductVariants = () => {

    const [variants, setVariants] = useState([]);

    const [products, setProducts] = useState([]);

    const [openMenuId, setOpenMenuId] = useState(null);


    const [pagination, setPagination] =
        useState({
            page: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 1
        });


    const [counts, setCounts] =
        useState({
            total: 0,
            active: 0,
            inactive: 0
        });


    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("ALL");

    const [sort, setSort] =
        useState("NEWEST");

    const [productId, setProductId] =
        useState("");


    const [loading, setLoading] =
        useState(false);

    const [serverError, setServerError] =
        useState("");


    const [showVariantForm, setShowVariantForm] =
        useState(false);

    const [editingVariant, setEditingVariant] =
        useState(null);

    const [formLoading, setFormLoading] =
        useState(false);

    const [formError, setFormError] =
        useState("");


    /* --------------------------------
       Fetch Variants
    -------------------------------- */

    const fetchVariants = useCallback(
        async () => {

            try {

                setLoading(true);
                setServerError("");


                const result =
                    await getAdminProductVariants({

                        page: pagination.page,

                        limit: pagination.limit,

                        search,

                        status,

                        sort,

                        productId

                    });


                setVariants(
                    result.data || []
                );

                setPagination(
                    result.pagination
                );

                setCounts(
                    result.counts
                );

            }
            catch (err) {

                setServerError(
                    err.response?.data?.message ||
                    "Unable to load product variants."
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
            status,
            sort,
            productId
        ]
    );


    useEffect(() => {

        fetchVariants();

    }, [fetchVariants]);


    /* --------------------------------
       Products
    -------------------------------- */

    useEffect(() => {

        const fetchProducts =
            async () => {

                try {

                    const result =
                        await getAdminProducts({

                            page: 1,

                            limit: 100,

                            search: "",

                            status: "ACTIVE",

                            sort: "NAME_ASC",

                            categoryId: ""

                        });


                    setProducts(
                        result.data || []
                    );

                }
                catch (err) {

                    console.error(
                        "Unable to load products:",
                        err
                    );

                }

            };


        fetchProducts();

    }, []);


    /* --------------------------------
       Filters
    -------------------------------- */

    const resetPage = () => {

        setPagination(current => ({

            ...current,

            page: 1

        }));

    };


    const handleSearchChange = value => {

        setSearch(value);

        resetPage();

    };


    const handleStatusFilterChange = value => {

        setStatus(value);

        resetPage();

    };


    const handleSortChange = value => {

        setSort(value);

        resetPage();

    };


    const handleProductChange = event => {

        setProductId(
            event.target.value
        );

        resetPage();

    };


    /* --------------------------------
       Pagination
    -------------------------------- */

    const changePage = page => {

        if (
            page < 1 ||
            page > pagination.totalPages
        ) {

            return;

        }


        setPagination(current => ({

            ...current,

            page

        }));

    };


    /* --------------------------------
       Form
    -------------------------------- */

    const openCreateForm = () => {

        setEditingVariant(null);

        setFormError("");

        setShowVariantForm(true);

    };


    const openEditForm = variant => {

        setEditingVariant(variant);

        setFormError("");

        setShowVariantForm(true);

    };


    const closeVariantForm = () => {

        if (formLoading) {

            return;

        }


        setShowVariantForm(false);

        setEditingVariant(null);

        setFormError("");

    };


    const handleCreateVariant = async ({
        variantData,
        images
    }) => {

        try {

            setFormLoading(true);
            setFormError("");


            const result =
                await createProductVariant(
                    variantData
                );


            const variant =
                result.data;


            if (images?.length) {

                await addProductVariantImages(
                    variant._id,
                    images
                );

            }


            toastSuccess(
                "Product variant created successfully"
            );


            closeVariantForm();


            if (pagination.page !== 1) {

                setPagination(current => ({

                    ...current,

                    page: 1

                }));

            }
            else {

                await fetchVariants();

            }

        }
        catch (err) {

            const message =
                err.response?.data?.message ||
                "Unable to create product variant.";

            toastError(message);

        }
        finally {

            setFormLoading(false);

        }

    };


    const handleUpdateVariant = async ({
        variantData,
        images
    }) => {

        if (!editingVariant) {

            return;

        }


        try {

            setFormLoading(true);
            setFormError("");


            await updateProductVariant(
                editingVariant._id,
                variantData
            );


            if (images?.length) {

                await addProductVariantImages(
                    editingVariant._id,
                    images
                );

            }


            toastSuccess(
                "Product variant updated successfully"
            );


            closeVariantForm();

            await fetchVariants();

        }
        catch (err) {

            const message =
                err.response?.data?.message ||
                "Unable to update product variant.";

            toastError(message);

        }
        finally {

            setFormLoading(false);

        }

    };


    const handleFormSubmit = data => {

        if (editingVariant) {

            return handleUpdateVariant(data);

        }


        return handleCreateVariant(data);

    };


    /* --------------------------------
       Status
    -------------------------------- */

    const handleStatusChange = async variant => {

        const nextStatus =
            !variant.isActive;


        const action =
            nextStatus
                ? "activate"
                : "deactivate";


        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} variant "${variant.sku}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setServerError("");

            setLoading(true);


            await updateProductVariantStatus(
                variant._id,
                nextStatus
            );


            toastSuccess(

                nextStatus
                    ? "Variant activated successfully"
                    : "Variant deactivated successfully"

            );


            await fetchVariants();

        }
        catch (err) {

            const message =
                err.response?.data?.message ||
                `Unable to ${action} variant.`;

            toastError(message);

        }
        finally {

            setLoading(false);

        }

    };


    /* --------------------------------
       Delete Variant Image
    -------------------------------- */

    const handleDeleteVariantImage =
        async image => {

            if (!editingVariant) {

                return;

            }


            const confirmed =
                window.confirm(
                    "Delete this variant image?"
                );


            if (!confirmed) {

                return;

            }


            try {

                setFormLoading(true);
                setFormError("");


                const result =
                    await deleteProductVariantImage(
                        editingVariant._id,
                        image._id
                    );


                setEditingVariant(
                    result.data
                );


                toastSuccess(
                    "Variant image deleted successfully"
                );

            }
            catch (err) {

                const message =
                    err.response?.data?.message ||
                    "Unable to delete variant image.";

                toastError(message);

            }
            finally {

                setFormLoading(false);

            }

        };


    /* --------------------------------
       Delete Variant
    -------------------------------- */

    const handleDeleteVariant =
        async variant => {

            const confirmed =
                window.confirm(
                    `Delete variant "${variant.sku}"? This action cannot be undone.`
                );


            if (!confirmed) {

                return;

            }


            try {

                setServerError("");

                setLoading(true);


                await deleteProductVariant(
                    variant._id
                );


                toastSuccess(
                    "Product variant deleted successfully"
                );


                if (
                    variants.length === 1 &&
                    pagination.page > 1
                ) {

                    setPagination(current => ({

                        ...current,

                        page:
                            current.page - 1

                    }));

                }
                else {

                    await fetchVariants();

                }

            }
            catch (err) {

                const message =
                    err.response?.data?.message ||
                    "Unable to delete product variant.";

                toastError(message);

            }
            finally {

                setLoading(false);

            }

        };


    return (

        <div className="space-y-6">

            <AdminPageHeader
                title="Product Variants"
                description="Manage product variants, pricing and stock"
                actionLabel="Add Variant"
                onAction={openCreateForm}
            />


            {/* Statistics */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-3
            ">

                <AdminStatCard
                    label="Total Variants"
                    value={counts.total}
                />

                <AdminStatCard
                    label="Active"
                    value={counts.active}
                />

                <AdminStatCard
                    label="Inactive"
                    value={counts.inactive}
                />

            </div>


            {/* Filters */}

            <div className="
                flex
                flex-col
                gap-3
                lg:flex-row
                lg:items-center
            ">

                <div className="flex-1">

                    <AdminFilter
                        search={search}
                        onSearchChange={
                            handleSearchChange
                        }
                        searchPlaceholder="Search by SKU..."
                        status={status}
                        onStatusChange={
                            handleStatusFilterChange
                        }
                        statusOptions={[
                            {
                                value: "ALL",
                                label: "All Status"
                            },
                            {
                                value: "ACTIVE",
                                label: "Active"
                            },
                            {
                                value: "INACTIVE",
                                label: "Inactive"
                            }
                        ]}
                        sort={sort}
                        onSortChange={
                            handleSortChange
                        }
                        sortOptions={[
                            {
                                value: "NEWEST",
                                label: "Newest"
                            },
                            {
                                value: "OLDEST",
                                label: "Oldest"
                            },
                            {
                                value: "SKU_ASC",
                                label: "SKU A-Z"
                            },
                            {
                                value: "SKU_DESC",
                                label: "SKU Z-A"
                            },
                            {
                                value: "PRICE_ASC",
                                label: "Price Low-High"
                            },
                            {
                                value: "PRICE_DESC",
                                label: "Price High-Low"
                            }
                        ]}
                    />

                </div>


                <select
                    value={productId}
                    onChange={
                        handleProductChange
                    }
                    className="
                        admin-select
                        lg:w-56
                    "
                >

                    <option value="">
                        All Products
                    </option>

                    {products.map(product => (

                        <option
                            key={product._id}
                            value={product._id}
                        >
                            {product.name}
                            {product.brand
                                ? ` - ${product.brand}`
                                : ""}
                        </option>

                    ))}

                </select>

            </div>


            {/* Error */}

            {serverError && (

                <div className="admin-error">

                    {serverError}

                </div>

            )}


            {/* Variants */}

            <div className="
                admin-card
                w-full
                min-w-0
                overflow-hidden
            ">

                <div className="
                    w-full
                    min-w-0
                    overflow-x-auto
                ">
                    <table className="
                        admin-table
                        w-full
                        table-fixed
                    ">

                        <thead className="
                            border-b
                            border-gray-200
                            bg-gray-50
                        ">

                            <tr>

                                <th className="admin-table-header">
                                    Product
                                </th>


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
                                    Discount%
                                </th>

                                <th className="admin-table-header">
                                    Discount Price
                                </th>

                                <th className="admin-table-header">
                                    Stock
                                </th>

                                <th className="admin-table-header">
                                    Status
                                </th>

                                <th className="
                                    admin-table-header
                                    w-[8%]
                                    text-right
                                ">
                                    Actions
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
                                        colSpan="10"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        Loading variants...
                                    </td>

                                </tr>

                            ) : variants.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="10"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                        "
                                    >

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-gray-900
                                        ">
                                            No product variants found
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            text-gray-500
                                        ">
                                            Try changing your search or filters.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                variants.map(variant => {

                                    const inventory =
                                        variant.inventory;

                                    const quantity =
                                        inventory?.quantity ?? 0;

                                    const threshold =
                                        inventory?.lowStockThreshold ?? 10;

                                    const hasInventory =
                                        Boolean(inventory);

                                    const isLowStock =
                                        hasInventory &&
                                        quantity > 0 &&
                                        quantity <= threshold;

                                    return (
                                        <Fragment key={variant._id}>

                                            <tr
                                                key={variant._id}
                                                className="
                                                    transition
                                                    hover:bg-gray-50
                                                "
                                            >

                                                {/* Product */}

                                                <td className="admin-table-cell">

                                                    <div className="min-w-0">

                                                        <p className="
                                                            max-w-full
                                                            truncate
                                                            text-sm
                                                            font-medium
                                                            text-gray-900
                                                        ">
                                                            {
                                                                variant.productId?.name ||
                                                                "—"
                                                            }
                                                        </p>

                                                        <p className="
                                                            mt-0.5
                                                            text-xs
                                                            text-gray-500
                                                        ">
                                                            {
                                                                variant.productId?.brand ||
                                                                ""
                                                            }
                                                        </p>

                                                    </div>

                                                </td>

                                                <td className="admin-table-cell">
                                                    {variant.color}
                                                </td>

                                                <td className="admin-table-cell">
                                                    {variant.primarySpecification ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-gray-500">
                                                                {variant.primarySpecification.name}
                                                            </span>

                                                            <span className="text-sm font-medium text-gray-900">
                                                                {variant.primarySpecification.value}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>

                                                <td className="admin-table-cell">
                                                    {variant.secondarySpecification?.name ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-gray-500">
                                                                {variant.secondarySpecification.name}
                                                            </span>

                                                            <span className="text-sm font-medium text-gray-900">
                                                                {variant.secondarySpecification.value}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>

                                                
                                                {/* Price */}

                                                <td className="admin-table-cell">

                                                    ₹{variant.price}

                                                </td>

                                                {/* Discount Percentage */}

                                                <td className="admin-table-cell">
                                                    {variant.discountPercentage?? "—"} %
                                                </td>


                                                {/* Discount Price */}

                                                <td className="admin-table-cell">

                                                    {variant.discountPrice > 0
                                                        ? `₹${variant.discountPrice}`
                                                        : "—"}

                                                </td>


                                                {/* Stock */}

                                                <td className="admin-table-cell">

                                                    {!hasInventory ? (

                                                        <span className="
                                                            text-sm
                                                            text-gray-400
                                                        ">
                                                            No inventory
                                                        </span>

                                                    ) : quantity === 0 ? (

                                                        <span className="
                                                            text-sm
                                                            font-medium
                                                            text-red-600
                                                        ">
                                                            Out of stock
                                                        </span>

                                                    ) : isLowStock ? (

                                                        <span className="
                                                            text-sm
                                                            font-medium
                                                            text-amber-600
                                                        ">
                                                            {quantity} · Low stock
                                                        </span>

                                                    ) : (

                                                        <span className="
                                                            text-sm
                                                            font-medium
                                                            text-gray-900
                                                        ">
                                                            {quantity}
                                                        </span>

                                                    )}

                                                </td>


                                                {/* Status */}

                                                <td className="admin-table-cell">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                variant
                                                            )
                                                        }
                                                        className={
                                                            variant.isActive
                                                                ? "admin-status-active hover:bg-green-100"
                                                                : "admin-status-inactive hover:bg-gray-200"
                                                        }
                                                    >

                                                        {variant.isActive
                                                            ? "Active"
                                                            : "Inactive"}

                                                    </button>

                                                </td>


                                                {/* Actions */}

                                                <td className="admin-table-cell">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        justify-center
                                                        gap-1
                                                        whitespace-nowrap
                                                    ">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditForm(
                                                                    variant
                                                                )
                                                            }
                                                            className="
                                                                admin-button-ghost
                                                                px-1
                                                                py-1
                                                                whitespace-nowrap
                                                                min-w-0

                                                            "
                                                        >
                                                            Edit
                                                        </button>
                                                        
                                                        <div className="relative">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setOpenMenuId(
                                                                        openMenuId === variant._id
                                                                            ? null
                                                                            : variant._id
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    text-lg
                                                                    text-gray-500
                                                                    hover:bg-gray-100
                                                                    hover:text-gray-900
                                                                "
                                                                aria-label="More actions"
                                                            >
                                                                ⋮
                                                            </button>

                                                            {openMenuId === variant._id && (
                                                                <div className="
                                                                    absolute
                                                                    right-0
                                                                    top-full
                                                                    z-50
                                                                    mt-1
                                                                    w-36
                                                                    rounded-xl
                                                                    border
                                                                    border-gray-200
                                                                    bg-white
                                                                    p-1
                                                                    shadow-lg
                                                                ">

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handleStatusChange(
                                                                                variant._id,
                                                                                !variant.isActive
                                                                            );
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="
                                                                            w-full
                                                                            rounded-lg
                                                                            px-3
                                                                            py-2
                                                                            text-left
                                                                            text-sm
                                                                            text-gray-700
                                                                            hover:bg-gray-100
                                                                        "
                                                                    >
                                                                        {variant.isActive
                                                                            ? "Deactivate"
                                                                            : "Activate"}
                                                                    </button>


                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handleDeleteVariant(variant._id);
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="
                                                                            w-full
                                                                            rounded-lg
                                                                            px-3
                                                                            py-2
                                                                            text-left
                                                                            text-sm
                                                                            text-red-600
                                                                            hover:bg-red-50
                                                                        "
                                                                    >
                                                                        Delete
                                                                    </button>

                                                                </div>
                                                            )}

                                                        </div>

                                                    </div>

                                                </td>

                                            </tr>
                                            <tr>
                                                <td
                                                    colSpan={10}
                                                    className="
                                                        px-6
                                                        pb-4
                                                        text-xs
                                                        text-gray-500
                                                        border-b
                                                        border-gray-200
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

                                })

                            )}

                        </tbody>

                    </table>

                </div>


                <AdminPagination
                    pagination={pagination}
                    loading={loading}
                    onPageChange={changePage}
                />

            </div>


            {/* Create / Edit */}

            <AdminModal
                open={showVariantForm}
                title={
                    editingVariant
                        ? "Edit Product Variant"
                        : "Add Product Variant"
                }
                description={
                    editingVariant
                        ? "Update variant information."
                        : "Create a new product variant."
                }
                onClose={closeVariantForm}
                loading={formLoading}
                error={formError}
            >

                <ProductVariantForm
                    initialData={editingVariant}
                    products={products}
                    onSubmit={handleFormSubmit}
                    loading={formLoading}
                    onCancel={closeVariantForm}
                    onDeleteImage={
                        handleDeleteVariantImage
                    }
                />

            </AdminModal>

        </div>

    );

};


export default AdminProductVariants;