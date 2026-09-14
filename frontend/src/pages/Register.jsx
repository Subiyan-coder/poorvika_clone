import { useState } from "react";

import {
    useForm
} from "react-hook-form";

import {
    zodResolver
} from "@hookform/resolvers/zod";

import {
    useNavigate
} from "react-router-dom";

import {
    registrationOtpRequestSchema
} from "../validations/authValidation";

import FormInput from "../components/FormInput";

import {
    requestRegistrationOtp
} from "../services/authService";


const Register = () => {

    const navigate = useNavigate();

    const [type, setType] = useState("EMAIL");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);


    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(
            registrationOtpRequestSchema
        ),
        mode: "onChange"
    });


    const handleTypeChange = (newType) => {

        setType(newType);

        setServerError("");

        reset();

    };


    const onSubmit = async (data) => {

        setServerError("");

        try {

            setLoading(true);

            const result =
                await requestRegistrationOtp({
                    identifier: data.identifier.trim(),
                    type
                });


            navigate("/verify-otp", {
                state: {
                    identifier:
                        result.data.identifier,

                    type:
                        result.data.type
                }
            });

        }
        catch (err) {

            setServerError(
                err.response?.data?.message ||
                "Unable to send OTP. Please try again."
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (
        <div className="w-full">

            {/* Heading */}

            <div className="mb-8">

                <h1 className="
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-gray-900
                ">
                    Create your account
                </h1>

                <p className="
                    mt-2
                    text-sm
                    text-gray-500
                ">
                    Verify your contact to get started
                </p>

            </div>


            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >

                {/* Verification method */}

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    ">
                        Verify with
                    </label>


                    <div className="
                        grid
                        grid-cols-2
                        gap-2
                        rounded-xl
                        bg-gray-100
                        p-1
                    ">

                        <button
                            type="button"
                            onClick={() =>
                                handleTypeChange("EMAIL")
                            }
                            className={`
                                rounded-lg
                                py-2.5
                                text-sm
                                font-medium
                                transition
                                ${
                                    type === "EMAIL"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                }
                            `}
                        >
                            Email
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handleTypeChange("PHONE")
                            }
                            className={`
                                rounded-lg
                                py-2.5
                                text-sm
                                font-medium
                                transition
                                ${
                                    type === "PHONE"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                }
                            `}
                        >
                            Phone
                        </button>

                    </div>

                </div>


                {/* Identifier */}

                <FormInput
                    id="identifier"
                    name="identifier"
                    label={
                        type === "EMAIL"
                            ? "Email"
                            : "Phone Number"
                    }
                    type={
                        type === "EMAIL"
                            ? "email"
                            : "tel"
                    }
                    placeholder={
                        type === "EMAIL"
                            ? "Enter your email"
                            : "Enter your phone number"
                    }
                    register={register}
                    error={errors.identifier}
                />


                {/* Server Error */}

                {serverError && (
                    <p className="
                        text-xs
                        text-red-500
                    ">
                        {serverError}
                    </p>
                )}


                {/* Continue */}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        h-12
                        w-full
                        rounded-xl
                        bg-gray-900
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-gray-800
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Sending OTP..."
                        : "Continue"}
                </button>


                {/* Login */}

                <p className="
                    pt-2
                    text-center
                    text-sm
                    text-gray-500
                ">

                    Already have an account?

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        disabled={loading}
                        className="
                            ml-1
                            font-medium
                            text-gray-900
                            hover:underline
                        "
                    >
                        Login
                    </button>

                </p>

            </form>

        </div>
    );
};


export default Register;