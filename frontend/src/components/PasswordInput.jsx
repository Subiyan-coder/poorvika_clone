import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

const PasswordInput = (
    {
        id,
        name,
        label = "Password",
        placeHolder = "Enter your password",
        register,
        error,
        showValidation = true
    }
) => {

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const passwordRules = [
        {
            label : "At least 8 characters needed",
            valid : password.length >= 8
        },

        {
            label : "At least one uppercase needed",
            valid : /[A-Z]/.test(password)
        },

        {
            label : "At least one lowercase needed",
            valid : /[a-z]/.test(password)
        },

        {
            label : "At least one number needed",
            valid : /\d/.test(password)
        }
    ];

    const registration = register(name);

    return (
        <div className="w-full">

            <label className="
                mb-2
                block
                text-sm
                font-medium
                text-grey-700
            ">
                {label}
            </label>

            <div className="relative">

                <input
                    id={id}
                    type={
                        showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder={placeHolder}
                    {...registration}
                    onChange={(event) => {
                        registration.onChange(event);
                        setPassword(event.target.value)
                    }}

                    className={`
                        h-12
                        w-full
                        rounded-x1
                        border
                        bg-white
                        px-4
                        pr-12
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        placeholder:text-gray-400
                        focus:ring-2
                        ${
                            error
                                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                        }
                    `}
                />

                <button 
                    type="button"
                    onClick={() => 
                        setShowPassword(
                            !showPassword
                        )
                    }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-2
                        text-gray-500
                        transition
                        hover:bg-gray-100
                        hover:text-gray-800
                    "
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >

                    {showPassword ? (
                        <EyeOff size={19} />
                    ) : (
                        <Eye size={19} />
                    )}


                </button>

            </div>

            {/* Password requirements */}

            {showValidation &&
                password.length > 0 && (

                <div className="
                    mt-3
                    space-y-1.5
                ">

                    {passwordRules.map(
                        (rule) => (

                            <div
                                key={rule.label}
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    ${
                                        rule.valid
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }
                                `}
                            >

                                {rule.valid ? (
                                    <Check
                                        size={14}
                                    />
                                ) : (
                                    <X
                                        size={14}
                                    />
                                )}

                                <span>
                                    {rule.label}
                                </span>

                            </div>

                        )
                    )}

                </div>

            )}

            {/* Normal form error */}

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


export default PasswordInput;