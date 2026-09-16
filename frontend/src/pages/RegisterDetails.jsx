import { useForm } from "react-hook-form";

import {
    zodResolver
} from "@hookform/resolvers/zod";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    registerSchema
} from "../validations/authValidation";

import FormInput from "../components/FormInput";

import PasswordInput from "../components/PasswordInput";

import {
    register as registerUser,
    getCurrentUser
} from "../services/authService";

import { useAuth } from "../context/useAuth";

import { useState } from "react";


const RegisterDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        identifier,
        type
    } = location.state || {};

    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser } = useAuth();

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(
            registerSchema
        ),
        mode: "onChange",
        defaultValues: {
            email:
                type === "EMAIL"
                    ? identifier
                    : "",
            phone:
                type === "PHONE"
                    ? identifier
                    : ""
        }
    });


    if (!identifier || !type) {

        return (
            <div className="w-full">

                <h1 className="
                    text-2xl
                    font-semibold
                    text-gray-900
                ">
                    Registration session expired
                </h1>

                <p className="
                    mt-2
                    text-sm
                    text-gray-500
                ">
                    Please start registration again.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/register")
                    }
                    className="
                        mt-6
                        text-sm
                        font-medium
                        text-gray-900
                        hover:underline
                    "
                >
                    Back to registration
                </button>

            </div>
        );
    }


    const onSubmit = async (data) => {

        setServerError("");

        try {

            setLoading(true);

            await registerUser({
                name: data.name,
                email:
                    type === "EMAIL"
                        ? identifier
                        : data.email,
                phone:
                    type === "PHONE"
                        ? identifier
                        : data.phone,
                password: data.password,
                verifiedIdentifier: identifier,
                verifiedType: type
            });

            const response = await getCurrentUser();

            setUser(
                response.data?.user || null
            );

            navigate("/");

        }
        catch (err) {

            setServerError(
                err.response?.data?.message ||
                "Unable to create your account. Please try again."
            );

        }
        finally {

            setLoading(false);

        }
    };


    return (
        <div className="w-full">

            {/* Heading */}

            <div className="mb-7">

                <h1 className="
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-gray-900
                ">
                    Complete your account
                </h1>

                <p className="
                    mt-2
                    text-sm
                    text-gray-500
                ">
                    Enter your details to finish registration
                </p>

            </div>


            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >

                {/* Name */}

                <FormInput
                    id="name"
                    name="name"
                    label="Full Name"
                    placeholder="Enter your name"
                    register={register}
                    error={errors.name}
                    disabled={loading}
                />


                {/* Email */}

                <div className="relative">

                    <FormInput
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        register={register}
                        error={errors.email}
                        disabled={
                            loading ||
                            type === "EMAIL"
                        }
                    />

                    {type === "EMAIL" && (
                        <span className="
                            absolute
                            right-3
                            top-9
                            text-xs
                            font-medium
                            text-green-600
                        ">
                            ✓ Verified
                        </span>
                    )}

                </div>


                {/* Phone */}

                <div className="relative">

                    <FormInput
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your phone number"
                        register={register}
                        error={errors.phone}
                        disabled={
                            loading ||
                            type === "PHONE"
                        }
                    />

                    {type === "PHONE" && (
                        <span className="
                            absolute
                            right-3
                            top-9
                            text-xs
                            font-medium
                            text-green-600
                        ">
                            ✓ Verified
                        </span>
                    )}

                </div>


                {/* Password */}

                <PasswordInput
                    id="password"
                    name="password"
                    register={register}
                    error={errors.password}
                    showValidation={true}
                />


                {/* Confirm Password */}

                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    register={register}
                    error={errors.confirmPassword}
                    showValidation={false}
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


                {/* Submit */}

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
                        ? "Creating account..."
                        : "Create Account"}
                </button>

            </form>

        </div>
    );
};


export default RegisterDetails;