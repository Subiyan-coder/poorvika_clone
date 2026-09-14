const AdminModal = ({
    open,
    title,
    description,
    onClose,
    loading = false,
    error,
    children
}) => {

    if (!open) {
        return null;
    }


    return (
        <div className="admin-modal-overlay">

            <div className="admin-modal">

                <div className="admin-modal-header">

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-gray-900
                        ">
                            {title}
                        </h2>

                        {description && (
                            <p className="
                                mt-0.5
                                text-sm
                                text-gray-500
                            ">
                                {description}
                            </p>
                        )}

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-xl
                            text-gray-400
                            transition
                            hover:bg-gray-100
                            hover:text-gray-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                <div className="admin-modal-body">

                    {error && (
                        <div className="
                            admin-error
                            mb-5
                        ">
                            {error}
                        </div>
                    )}

                    {children}

                </div>

            </div>

        </div>
    );
};


export default AdminModal;