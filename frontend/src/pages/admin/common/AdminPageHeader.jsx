const AdminPageHeader = ({
    title,
    description,
    actionLabel,
    onAction
}) => {

    return (
        <div className="mb-6 flex items-start justify-between gap-4">

            <div>
                <h1 className="
                    text-2xl
                    font-semibold
                    tracking-tight
                    text-gray-900
                ">
                    {title}
                </h1>

                {description && (
                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">
                        {description}
                    </p>
                )}
            </div>


            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="
                        inline-flex
                        h-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-gray-900
                        px-5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-gray-800
                        focus:outline-none
                        focus:ring-2
                        focus:ring-gray-300
                        focus:ring-offset-2
                    "
                >
                    + {actionLabel}
                </button>
            )}

        </div>
    );
};


export default AdminPageHeader;