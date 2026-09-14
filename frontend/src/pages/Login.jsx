import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import { loginSchema } from "../validations/authValidation";
import PasswordInput from "../components/PasswordInput";
import FormInput from "../components/FormInput";

import { login as loginUser } from "../services/authService";
import { requestLoginOtp } from "../services/authService";

const Login = () => {

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);


    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const handleOtpLogin = async () => {

        setServerError("");

        const identifier =
            getValues("identifier")?.trim();

        if (!identifier) {

            setServerError(
                "Please enter your email or phone number first."
            );

            return;
        }

        const type = identifier.includes("@")
            ? "EMAIL"
            : "PHONE";

        try {

            setLoading(true);

            const result =
                await requestLoginOtp({
                    identifier,
                    type
                });

            navigate("/login/otp", {
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


    const onSubmit = async (data) => {

        setServerError("");

        const identifier = data.identifier.trim();

        const type = identifier.includes("@")
            ? "EMAIL"
            : "PHONE";

        try {

            setLoading(true);

            const result = await loginUser({
                identifier,
                type,
                password: data.password
            });

            setUser(result.data.user);

            if (result.data.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        }
        catch (err) {

            setServerError(
                err.response?.data?.message ||
                "Unable to login. Please try again."
            );

        }
        finally {

            setLoading(false);

        }
    };


    return (
        <div className="w-full">

            <div className="mb-8">

                <h1 className="
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-gray-900
                ">
                    Welcome back
                </h1>

                <p className="
                    mt-2
                    text-sm
                    text-gray-500
                ">
                    Sign in to continue to Poorvika
                </p>

            </div>


            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >

                <FormInput
                    id="identifier"
                    name="identifier"
                    label="Email or Phone"
                    placeholder="Enter your email or phone"
                    register={register}
                    error={errors.identifier}
                    disabled={loading}
                />


                <PasswordInput
                    id="password"
                    name="password"
                    register={register}
                    error={errors.password}
                    showValidation={false}
                    disabled={loading}
                />


                <div className="
                    flex
                    items-center
                    justify-between
                    text-sm
                ">

                    <Link
                        to="/register"
                        className="
                            font-medium
                            text-gray-900
                            hover:underline
                        "
                    >
                        Create account
                    </Link>
                    

                    <button
                        type="button"
                        className="
                            font-medium
                            text-gray-900
                            hover:underline
                        "
                    >
                        Forgot password?
                    </button>


                </div>


                {serverError && (
                    <p className="
                        text-xs
                        text-red-500
                    ">
                        {serverError}
                    </p>
                )}


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
                        ? "Logging in..."
                        : "Login"}
                </button>


                <div className="
                    flex
                    items-center
                    gap-4
                    py-1
                ">

                    <div className="
                        h-px
                        flex-1
                        bg-gray-200
                    "/>

                    <span className="
                        text-xs
                        text-gray-400
                    ">
                        OR
                    </span>

                    <div className="
                        h-px
                        flex-1
                        bg-gray-200
                    "/>

                </div>


                <button
                    type="button"
                    onClick={handleOtpLogin}
                    disabled={loading}
                    className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        text-sm
                        font-medium
                        text-gray-800
                        transition
                        hover:bg-gray-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading ? "Sending OTP..." : "Login with OTP"}
                </button>


                <button
                    type="button"
                    onClick={() => navigate("/")}
                    disabled={loading}
                    className="
                        w-full
                        pt-1
                        text-sm
                        font-medium
                        text-gray-500
                        transition
                        hover:text-gray-900
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Continue as Guest
                </button>

            </form>

        </div>
    );
};


export default Login;