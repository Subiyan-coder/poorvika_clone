const AdminFilter = ({
    search,
    onSearchChange,
    searchPlaceholder = "Search...",
    status,
    onStatusChange,
    statusOptions = [],
    sort,
    onSortChange,
    sortOptions = [],
    categoryId,
    onCategoryChange,
    categories = []
}) => {

    return (
        <div className="
            flex
            flex-col
            gap-3
            admin-card
            p-4
            lg:flex-row
            lg:items-center
        ">

            <input
                type="text"
                value={search}
                onChange={event =>
                    onSearchChange(
                        event.target.value
                    )
                }
                placeholder={searchPlaceholder}
                className="
                    admin-input
                    lg:flex-1
                "
            />


            {categories.length > 0 && (
                <select
                    value={categoryId}
                    onChange={event =>
                        onCategoryChange(
                            event.target.value
                        )
                    }
                    className="admin-select"
                >

                    <option value="">
                        All Categories
                    </option>

                    {categories.map(category => (

                        <option
                            key={category._id}
                            value={category._id}
                        >
                            {category.name}
                        </option>

                    ))}

                </select>
            )}


            {statusOptions.length > 0 && (
                <select
                    value={status}
                    onChange={event =>
                        onStatusChange(
                            event.target.value
                        )
                    }
                    className="admin-select"
                >

                    {statusOptions.map(option => (

                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))}

                </select>
            )}


            {sortOptions.length > 0 && (
                <select
                    value={sort}
                    onChange={event =>
                        onSortChange(
                            event.target.value
                        )
                    }
                    className="admin-select"
                >

                    {sortOptions.map(option => (

                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))}

                </select>
            )}

        </div>
    );
};


export default AdminFilter;