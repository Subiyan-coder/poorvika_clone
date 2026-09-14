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

import ProductForm from "../../components/admin/product/ProductForm";


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
    getAdminProducts,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
    addProductImages,
    deleteProductImage
} from "../../services/admin/adminProductService";


import {
    getAdminCategories
} from "../../services/admin/adminCategoryService";


const AdminProducts = () => {

    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);

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

    const [categoryId, setCategoryId] =
        useState("");


    const [loading, setLoading] =
        useState(false);

    const [serverError, setServerError] =
        useState("");


    const [showProductForm, setShowProductForm] =
        useState(false);

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [formLoading, setFormLoading] =
        useState(false);

    const [formError, setFormError] =
        useState("");


    /* --------------------------------
       Fetch Products
    -------------------------------- */

    const fetchProducts = useCallback(
        async () => {

            try {

                setLoading(true);
                setServerError("");


                const result =
                    await getAdminProducts({

                        page: pagination.page,
                        limit: pagination.limit,
                        search,
                        status,
                        sort,
                        categoryId

                    });


                setProducts(result.data);

                setPagination(result.pagination);

                setCounts(result.counts);

            }
            catch (err) {

                setServerError(
                    err.response?.data?.message ||
                    "Unable to load products."
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
            categoryId
        ]
    );


    useEffect(() => {

        fetchProducts();

    }, [fetchProducts]);


    /* --------------------------------
       Categories
    -------------------------------- */

    useEffect(() => {

        const fetchCategories =
            async () => {

                try {

                    const result =
                        await getAdminCategories({
                            page: 1,
                            limit: 100
                        });


                    setCategories(
                        result.data.categories.filter(
                            category =>
                                category.isActive
                        )
                    );

                }
                catch (err) {

                    console.error(
                        "Unable to load categories:",
                        err
                    );

                }

            };


        fetchCategories();

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


    const handleCategoryChange = value => {

        setCategoryId(value);
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

        setEditingProduct(null);
        setFormError("");
        setShowProductForm(true);

    };


    const openEditForm = product => {

        setEditingProduct(product);
        setFormError("");
        setShowProductForm(true);

    };


    const closeProductForm = () => {

        if (formLoading) {
            return;
        }


        setShowProductForm(false);
        setEditingProduct(null);
        setFormError("");

    };


    const handleCreateProduct = async ({
        productData,
        images
    }) => {

        try {

            setFormLoading(true);
            setFormError("");


            const result =
                await createProduct(productData);


            const product =
                result.data;


            if (images?.length) {

                await addProductImages(
                    product._id,
                    images
                );

            }

            toastSuccess(
                "Product created successfully"
            );

            closeProductForm();


            if (pagination.page !== 1) {

                setPagination(current => ({
                    ...current,
                    page: 1
                }));

            }
            else {

                await fetchProducts();

            }

        }
        catch (err) {

            const message =
                err.response?.data?.message ||
                "Unable to create product.";

            toastError(message);

        }
        finally {

            setFormLoading(false);

        }

    };


    const handleUpdateProduct = async ({
        productData,
        images
    }) => {

        if (!editingProduct) {
            return;
        }


        try {

            setFormLoading(true);
            setFormError("");


            await updateProduct(
                editingProduct._id,
                productData
            );


            if (images?.length) {

                await addProductImages(
                    editingProduct._id,
                    images
                );

            }

            toastSuccess(
                "Product updated successfully"
            );

            closeProductForm();

            await fetchProducts();

        }
        catch (err) {

            const message =
                err.response?.data?.message ||
                "Unable to update product.";

            toastError(message);

        }
        finally {

            setFormLoading(false);

        }

    };


    const handleFormSubmit = data => {

        if (editingProduct) {

            return handleUpdateProduct(data);

        }


        return handleCreateProduct(data);

    };


    /* --------------------------------
       Status
    -------------------------------- */

    const handleStatusChange = async product => {

        const nextStatus =
            !product.isActive;

        const action =
            nextStatus
                ? "activate"
                : "deactivate";


        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} "${product.name}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setServerError("");
            setLoading(true);


            await updateProductStatus(
                product._id,
                nextStatus
            );

            toastSuccess(
                nextStatus
                    ? "Product activated successfully"
                    : "Product deactivated successfully"
            );


            await fetchProducts();

        }
        catch (err) {

            const message =
                err.response?.data?.message ||
                `Unable to ${action} product.`;

            toastError(message);

        }
        finally {

            setLoading(false);

        }

    };


    /* --------------------------------
      Delete Product Image
    -------------------------------- */

    const handleDeleteProductImage =
        async image => {

            if (!editingProduct) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Delete this product image?"
                );


            if (!confirmed) {
                return;
            }


            try {

                setFormLoading(true);
                setFormError("");


                const result =
                    await deleteProductImage(
                        editingProduct._id,
                        image._id
                    );


                setEditingProduct(
                    result.data
                );

                toastSuccess(
                    "Product image deleted successfully"
                );

            }
            catch (err) {

                const message =
                    err.response?.data?.message ||
                    "Unable to delete product image.";

                toastError(message);

            }
            finally {

                setFormLoading(false);

            }

        };


    /* --------------------------------
       Delete Product
    -------------------------------- */

    const handleDeleteProduct =
        async product => {

            const confirmed =
                window.confirm(
                    `Delete "${product.name}"? This action cannot be undone.`
                );


            if (!confirmed) {
                return;
            }


            try {

                setServerError("");
                setLoading(true);


                await deleteProduct(
                    product._id
                );

                toastSuccess(
                    "Product deleted successfully"
                );


                if (
                    products.length === 1 &&
                    pagination.page > 1
                ) {

                    setPagination(current => ({
                        ...current,
                        page: current.page - 1
                    }));

                }
                else {

                    await fetchProducts();

                }

            }
            catch (err) {

                const message =
                    err.response?.data?.message ||
                    "Unable to delete product.";

                toastError(message);

            }
            finally {

                setLoading(false);

            }

        };


    return (

        <div className="space-y-6">

            <AdminPageHeader
                title="Products"
                description="Manage your product catalog"
                actionLabel="Add Product"
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
                    label="Total Products"
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

            <AdminFilter
                search={search}
                onSearchChange={
                    handleSearchChange
                }
                searchPlaceholder="
                    Search products, brands, descriptions...
                "
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
                        value: "NAME_ASC",
                        label: "Name A-Z"
                    },
                    {
                        value: "NAME_DESC",
                        label: "Name Z-A"
                    }
                ]}
                categoryId={categoryId}
                onCategoryChange={
                    handleCategoryChange
                }
                categories={categories}
            />


            {/* Error */}

            {serverError && (

                <div className="admin-error">
                    {serverError}
                </div>

            )}


            {/* Products */}

            <div className="
                admin-card
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="admin-table">

                        <thead className="
                            border-b
                            border-gray-200
                            bg-gray-50
                        ">

                            <tr>

                                <th className="
                                    admin-table-header
                                ">
                                    Product
                                </th>


                                <th className="
                                    admin-table-header
                                ">
                                    Brand
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Variants
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Category
                                </th>

                                <th className="
                                    admin-table-header
                                ">
                                    Status
                                </th>

                                <th className="
                                    admin-table-header
                                    text-right
                                    pr-4
                                    mr-4
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
                                        colSpan="7"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        Loading products...
                                    </td>

                                </tr>

                            ) : products.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
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
                                            No products found
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

                                products.map(product => (
                                    
                                    <Fragment key={product.id}>
                                   
                                        <tr
                                            key={product._id}
                                            className="
                                                transition
                                                hover:bg-gray-50
                                            "
                                        >

                                            <td className="
                                                admin-table-cell
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className="
                                                        h-12
                                                        w-12
                                                        shrink-0
                                                        overflow-hidden
                                                        rounded-xl
                                                        border
                                                        border-gray-200
                                                        bg-gray-100
                                                    ">

                                                        {product.images?.[0]?.url ? (

                                                            <img
                                                                src={
                                                                    product.images[0].url
                                                                }
                                                                alt={product.name}
                                                                className="
                                                                    h-full
                                                                    w-full
                                                                    object-cover
                                                                "
                                                            />

                                                        ) : (

                                                            <div className="
                                                                flex
                                                                h-full
                                                                w-full
                                                                items-center
                                                                justify-center
                                                                text-xs
                                                                text-gray-400
                                                            ">
                                                                No image
                                                            </div>

                                                        )}

                                                    </div>


                                                    <div className="min-w-0">

                                                        <p className="
                                                            max-w-[260px]
                                                            truncate
                                                            text-sm
                                                            font-medium
                                                            text-gray-900
                                                        ">
                                                            {product.name}
                                                        </p>

                                                        <p className="
                                                            mt-0.5
                                                            text-xs
                                                            text-gray-500
                                                        ">
                                                            {product.primarySpecification?.name}
                                                            {product.primarySpecification?.value
                                                                ? `: ${product.primarySpecification.value}`
                                                                : ""}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="
                                                admin-table-cell
                                            ">
                                                {product.brand}
                                            </td>
                                            
                                            <td className="admin-table-cell">
                                                <div className="flex items-center gap-2">

                                                    <span className="admin-status-active">
                                                        {product.activeVariantCount} Active
                                                    </span>

                                                    {product.inactiveVariants > 0 && (
                                                        <span className="admin-status-inactive">
                                                            {product.inactiveVariantCount} Inactive
                                                        </span>
                                                    )}

                                                </div>
                                            </td>

                                            <td className="
                                                admin-table-cell
                                            ">
                                                {product.categoryId?.name || "—"}
                                            </td>


                                            <td className="
                                                admin-table-cell
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            product
                                                        )
                                                    }
                                                    className={
                                                        product.isActive
                                                            ? "admin-status-active hover:bg-green-100"
                                                            : "admin-status-inactive hover:bg-gray-200"
                                                    }
                                                >
                                                    {product.isActive
                                                        ? "Active"
                                                        : "Inactive"
                                                    }
                                                </button>

                                            </td>


                                            <td className="
                                                admin-table-cell
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-4
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditForm(
                                                                product
                                                            )
                                                        }
                                                        className="
                                                            admin-button-ghost
                                                            px-2
                                                            py-1
                                                        "
                                                    >
                                                        Edit
                                                    </button>

                                                    <div className="relative">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setOpenMenuId(
                                                                        openMenuId === product._id
                                                                            ? null
                                                                            : product._id
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

                                                            {openMenuId === product._id && (
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
                                                                                product._id,
                                                                                !product.isActive
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
                                                                        {product.isActive
                                                                            ? "Deactivate"
                                                                            : "Activate"}
                                                                    </button>


                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handleDeleteProduct(product._id);
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
                                                    colSpan={8}
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
                                                        {product.sku}
                                                    </span>
                                                </td>
                                            </tr>

                                    </Fragment>
                                ))

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
                open={showProductForm}
                title={
                    editingProduct
                        ? "Edit Product"
                        : "Add Product"
                }
                description={
                    editingProduct
                        ? "Update product information."
                        : "Create a new product listing."
                }
                onClose={closeProductForm}
                loading={formLoading}
                error={formError}
            >

                <ProductForm
                    name="product-form"
                    id="product-form"
                    initialData={editingProduct}
                    categories={categories}
                    onSubmit={handleFormSubmit}
                    loading={formLoading}
                    onCancel={closeProductForm}
                    onDeleteImage={
                        handleDeleteProductImage
                    }
                />

            </AdminModal>

        </div>

    );

};


export default AdminProducts;