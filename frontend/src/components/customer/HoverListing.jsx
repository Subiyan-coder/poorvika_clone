const HoverListing = ({
    title,
    items = [],
    onItemClick
}) => {

    return (
        <div className="min-w-0">

            {title && (
                <h3
                    className="
                        mb-3
                        text-sm
                        font-semibold
                        text-orange-500
                    "
                >
                    {title}
                </h3>
            )}

            <div className="space-y-2">

                {items.map((item) => (

                    <button
                        key={item.id || item._id || item.name}
                        type="button"
                        onClick={() => onItemClick?.(item)}
                        className="
                            block
                            w-full
                            truncate
                            text-left
                            text-sm
                            text-gray-600
                            transition
                            hover:text-orange-500
                        "
                    >
                        {item.name}
                    </button>

                ))}

            </div>

        </div>
    );
};


export default HoverListing;