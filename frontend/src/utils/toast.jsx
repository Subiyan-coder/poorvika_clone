import toast from "react-hot-toast";


const showToast = (
    message,
    type = "success"
) => {

    return toast.custom(
        (t) => (

            <div className={`
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-white
                shadow-lg
                ${type === "success"
                    ? "bg-green-600"
                    : "bg-red-600"
                }
            `}>

                <span>
                    {message}
                </span>


                <button
                    type="button"
                    onClick={() =>
                        toast.dismiss(t.id)
                    }
                    className="
                        ml-2
                        text-lg
                        leading-none
                        text-gray-400
                        transition
                        hover:text-white
                    "
                    aria-label="Close notification"
                >
                    ×
                </button>

            </div>
        ),
        {
            duration: 3000
        }
    );
};


export const toastSuccess = (message) => {

    return showToast(
        message,
        "success"
    );

};


export const toastError = (message) => {

    return showToast(
        message,
        "error"
    );

};


export default showToast;