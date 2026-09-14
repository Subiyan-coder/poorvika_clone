const FormInput = ({
    id,
    name,
    label,
    type = "text",
    placeholder,
    register,
    error,
    disabled = false,
    numeric = false
}) => {

    return (
        <div className="w-full">

            <label
                htmlFor={id}
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                "
            >
                {label}
            </label>


            <input
                id={id}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                inputMode={numeric ? "numeric" : undefined}
                step={numeric ? "1" : undefined}
                min={numeric ? "0" : undefined}
                {...register(name)}
                className={`
                    h-12
                    w-full
                    rounded-xl
                    border
                    bg-white
                    px-4
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    focus:ring-2
                    ${
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                    }
                `}
            />


            {error && (
                <p className="
                    mt-1.5
                    text-xs
                    text-red-500
                ">
                    {error.message}
                </p>
            )}

        </div>
    );
};


export default FormInput;