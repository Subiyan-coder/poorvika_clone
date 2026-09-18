import { useEffect, useState, useCallback } from "react";
import {
    toastSuccess,
    toastError
} from "../../utils/toast";


import CategoryForm from "../../components/admin/CategoryForm";
import AdminStatCard from "../../components/admin/common/AdminStatCard";
import AdminFilter from "../../components/admin/common/AdminFilter";
import AdminPagination from "../../components/admin/common/AdminPagination";

import {
    getAdminCategories,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory
} from "../../services/admin/adminCategoryService";


const AdminCategories = () => {

    const [categories, setCategories] = useState([]);

    const [counts, setCounts] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    });

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("ALL");

    const [sort, setSort] = useState("NEWEST");

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(false);

    const [serverError, setServerError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingCategory, setEditingCategory] = useState(null);

    const [openMenuId, setOpenMenuId] = useState(null);


    const fetchCategories = useCallback(async () => {

        try {

            setLoading(true);
            setServerError("");

            const result = await getAdminCategories({
                page: pagination.page,
                limit: pagination.limit,
                search,
                status,
                sort
            });

            setCategories(result.data.categories);
            setPagination(result.data.pagination);
            setCounts(result.data.counts);

        }
        catch (err) {

            setServerError(
                err.response?.data?.message ||
                "Unable to load categories."
            );

        }
        finally {

            setLoading(false);

        }

    }, [
        pagination.page,
        pagination.limit,
        search,
        status,
        sort
    ]);


    useEffect(() => {

        fetchCategories();

    }, [fetchCategories]);


    const handleCreate = async (formData) => {

        try {

            setActionLoading(true);
            setServerError("");

            await createCategory(formData);

            toastSuccess(
                "Category created successfully"
            );

            setShowForm(false);

            setEditingCategory(null);

            await fetchCategories();

        }
        catch (err) {

            setServerError(
                err.response?.data?.message ||
                "Unable to create category."
            );

        }
        finally {

            setActionLoading(false);

        }
    };


    const handleUpdate = async (formData) => {

        try {

            setActionLoading(true);
            setServerError("");

            await updateCategory(
                editingCategory._id,
                formData
            );

            setShowForm(false);

            setEditingCategory(null);

            toastSuccess(
                "Category updated successfully" 
            );

            await fetchCategories();

        }
        catch (err) {

            const message =
                err.response?.data?.message ||
                "Unable to update category.";

            toastError(message);

        }
        finally {

            setActionLoading(false);

        }
    };


    const handleFormSubmit = async (formData) => {

        if (editingCategory) {
            await handleUpdate(formData);
        }
        else {
            await handleCreate(formData);
        }

    };


    const handleStatusChange = async (
        category
    ) => {

        const nextStatus =
            !category.isActive;

        const action =
            nextStatus
                ? "activate"
                : "deactivate";

        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} "${category.name}"?`
            );


        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);
            setServerError("");

            await updateCategoryStatus(
                category._id,
                nextStatus
            );

            toastSuccess(
                nextStatus
                    ? "category activated successfully"
                    : "category deactivated successfully"
            );

            await fetchCategories();

        }
        catch (err) {

            const message =
                err.response?.data?.message ||
                `Unable to ${action} category.`;

            toastError(message);

        }
        finally {

            setActionLoading(false);

        }
    };


    const handleDelete = async (
        category
    ) => {

        const confirmed = window.confirm(
            `Delete "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);
            setServerError("");

            await deleteCategory(
                category._id
            );

            toastSuccess(
                    "Category deleted successfully"
                );


            if (
                categories.length === 1 &&
                pagination.page > 1
            ) {
                setPagination((current) => ({
                    ...current,
                    page: current.page - 1
                }));
            }
            else {
                await fetchCategories();
            }

        }
        catch (err) {

            const message =
                    err.response?.data?.message ||
                    "Unable to delete category.";

                toastError(message);

        }
        finally {

            setActionLoading(false);

        }
    };


    const openCreate = () => {

        setEditingCategory(null);
        setShowForm(true);

    };


    const openEdit = (category) => {

        setEditingCategory(category);
        setShowForm(true);

    };


    const handleSearch = (value) => {

        setSearch(value);

        setPagination((current) => ({
            ...current,
            page: 1
        }));

    };


    const handleStatusChangeFilter = (value) => {

        setStatus(value);

        setPagination((current) => ({
            ...current,
            page: 1
        }));

    };


    const handleSortChange = (value) => {

        setSort(value);

        setPagination((current) => ({
            ...current,
            page: 1
        }));

    };


    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div>

                    <h1 className="
                        text-2xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                    ">
                        Categories
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">
                        Manage your product categories
                    </p>

                </div>


                <button
                    type="button"
                    onClick={openCreate}
                    className="
                        rounded-xl
                        bg-gray-900
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-gray-800
                    "
                >
                    + Add Category
                </button>

            </div>


            {/* Error */}

            {serverError && (

                <div className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                ">
                    {serverError}
                </div>

            )}


            {/* Stats */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-3
            ">

                
                <AdminStatCard
                    label="Total Categories"
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




                <AdminFilter
                    search={search}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search categories..."
                    status={status}
                    onStatusChange={handleStatusChangeFilter}
                    statusOptions={[
                        { value: "ALL", label: "All Status" },
                        { value: "ACTIVE", label: "Active" },
                        { value: "INACTIVE", label: "Inactive" }
                    ]}
                    sort={sort}
                    onSortChange={handleSortChange}
                    sortOptions={[
                        { value: "NEWEST", label: "Newest" },
                        { value: "OLDEST", label: "Oldest" },
                        { value: "NAME_ASC", label: "Name A-Z" },
                        { value: "NAME_DESC", label: "Name Z-A" }
                    ]}
                />


            {/* Table */}

            <div className="
                overflow-hidden   
                rounded-2xl
                border
                border-gray-200
                bg-white
            ">

                <div className="overflow-x-auto">

                    <table className="admin-table">

                        <thead className="
                            border-b
                            border-gray-100
                            bg-gray-50
                        ">

                            <tr>

                                <th className="admin-table-header">
                                    Category
                                </th>

                                <th className="admin-table-header">
                                    Heading
                                </th>

                                <th className="admin-table-header">
                                    SKU
                                </th>

                                <th className="admin-table-header">
                                    Products
                                </th>

                                <th className="admin-table-header">
                                    Status
                                </th>

                                <th className="admin-table-header text-right">
                                    Actions
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
                                        Loading categories...
                                    </td>
                                </tr>

                            ) : categories.length === 0 ? (

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
                                        No categories found.
                                    </td>
                                </tr>

                            ) : (

                                categories.map(
                                    (category) => (

                                        <tr
                                            key={category._id}
                                            className="
                                                border-b
                                                border-gray-100
                                                last:border-0
                                                hover:bg-gray-50
                                            "
                                        >

                                            <td className="admin-table-cell">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className="
                                                        h-11
                                                        w-11
                                                        overflow-hidden
                                                        rounded-xl
                                                        bg-gray-100
                                                    ">

                                                        {category.images?.url && (

                                                            <img
                                                                src={category.images.url}
                                                                alt={category.name}
                                                                className="
                                                                    h-full
                                                                    w-full
                                                                    object-cover
                                                                "
                                                            />

                                                        )}

                                                    </div>


                                                    <span className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-900
                                                    ">
                                                        {category.name}
                                                    </span>

                                                </div>

                                            </td>

                                            <td className="admin-table-cell">
                                                {category.heading}
                                            </td>

                                            <td className="admin-table-cell">
                                                {category.sku}
                                            </td>

                                            <td className="admin-table-cell">
                                                <div className="flex items-center gap-2">

                                                    <span className="admin-status-active">
                                                        {category.activeProductCount} Active
                                                    </span>

                                                    {category.inactiveProductCount > 0 && (
                                                        <span className="admin-status-inactive">
                                                            {category.inactiveProductCount} Inactive
                                                        </span>
                                                    )}

                                                </div>
                                            </td>


                                            <td className="admin-table-cell">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                category
                                                            )
                                                        }
                                                        className={
                                                            category.isActive
                                                                ? "admin-status-active hover:bg-green-100"
                                                                : "admin-status-inactive hover:bg-gray-200"
                                                        }
                                                    >

                                                        {category.isActive
                                                            ? "Active"
                                                            : "Inactive"}

                                                    </button>

                                            </td>

                                            <td className="admin-table-cell">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        justify-end
                                                        gap-4
                                                    ">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEdit(
                                                                    category
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
                                                                        openMenuId === category._id
                                                                            ? null
                                                                            : category._id
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

                                                            {openMenuId === category._id && (
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
                                                                                category._id,
                                                                                !category.isActive
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
                                                                        {category.isActive
                                                                            ? "Deactivate"
                                                                            : "Activate"}
                                                                    </button>


                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handleDelete(category);
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

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* Pagination */}

                <AdminPagination
                    pagination={pagination}
                    loading={loading}
                    onPageChange={(page) =>
                        setPagination(current => ({
                            ...current,
                            page
                        }))
                    }
                />

            </div>


            {/* Form */}

            {showForm && (

                <CategoryForm
                    name= "category-form"
                    id= "category-form"
                    category={editingCategory}
                    onSubmit={handleFormSubmit}
                    onClose={() => {
                        setShowForm(false);
                        setEditingCategory(null);
                    }}
                    loading={actionLoading}
                />

            )}

        </div>
    );
};



export default AdminCategories;