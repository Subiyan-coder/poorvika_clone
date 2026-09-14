const AdminPagination = ({
    pagination,
    loading,
    onPageChange
}) => {

    const {
        page,
        limit,
        totalItems,
        totalPages
    } = pagination;


    const start =
        totalItems === 0
            ? 0
            : ((page - 1) * limit) + 1;


    const end =
        Math.min(
            page * limit,
            totalItems
        );


    return (
        <div className="
            flex
            flex-col
            gap-3
            border-t
            border-gray-200
            px-6
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
        ">

            <p className="text-sm text-gray-500">

                {totalItems === 0
                    ? "No results"
                    : `Showing ${start}–${end} of ${totalItems}`
                }

            </p>


            <div className="
                flex
                items-center
                gap-2
            ">

                <button
                    type="button"
                    disabled={
                        page === 1 ||
                        loading
                    }
                    onClick={() =>
                        onPageChange(page - 1)
                    }
                    className="
                        admin-button-secondary
                        h-9
                        px-3
                    "
                >
                    Previous
                </button>


                <span className="
                    px-2
                    text-sm
                    text-gray-600
                ">
                    {page} / {totalPages}
                </span>


                <button
                    type="button"
                    disabled={
                        page === totalPages ||
                        loading
                    }
                    onClick={() =>
                        onPageChange(page + 1)
                    }
                    className="
                        admin-button-secondary
                        h-9
                        px-3
                    "
                >
                    Next
                </button>

            </div>

        </div>
    );
};


export default AdminPagination;