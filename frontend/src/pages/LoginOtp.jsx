import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import OtpInput from "../components/OtpInput";
import { login, requestLoginOtp } from "../services/authService";
import { toastSuccess } from "../utils/toast";


const LoginOtp = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { setUser } = useAuth();

    const {
        identifier,
        type
    } = location.state || {};

    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const [resendTimer, setResendTimer] = useState(60);
    const [resending, setResending] = useState(false);


    useEffect(() => {

        if (resendTimer <= 0) {
            return;
        }

        const timer = setInterval(() => {

            setResendTimer(
                previous => previous - 1
            );

        }, 1000);

        return () => clearInterval(timer);

    }, [resendTimer]);
    

    if (!identifier || !type) {

        return (
            <div className="w-full">

                <h1 className="
                    text-2xl
                    font-semibold
                    text-gray-900
                ">
                    Login session expired
                </h1>

                <p className="
                    mt-2
                    text-sm
                    text-gray-500
                ">
                    Please start login again.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="
                        mt-6
                        text-sm
                        font-medium
                        text-gray-900
                        hover:underline
                    "
                >
                    Back to login
                </button>

            </div>
        );
    }


    const handleOtpChange = (value) => {

        setOtp(value);
        setServerError("");

        if (!value) {
            setOtpError("");
            return;
        }

        if (value.length < 6) {
            setOtpError("OTP must be 6 digits");
            return;
        }

        setOtpError("");
    };


    const handleResendOtp = async () => {

        if (resendTimer > 0 || resending) {
            return;
        }

        try {

            setResending(true);
            setServerError("");

            await requestLoginOtp({
                identifier,
                type
            });

            setResendTimer(60);
            setOtp("");

            toastSuccess(
                "A new OTP has been sent"
            );

        }
        catch (err) {

            setServerError(
                err.response?.data?.message ||
                "Unable to resend OTP. Please try again."
            );

        }
        finally {

            setResending(false);

        }
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setServerError("");

        if (otp.length !== 6) {

            setOtpError(
                "Please enter the 6-digit OTP."
            );

            return;
        }

        try {

            setLoading(true);

            const result = await login({
                identifier,
                type,
                otp
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
                "OTP verification failed. Please try again."
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
                    Verify your {type === "EMAIL"
                        ? "email"
                        : "phone"}
                </h1>

                <p className="
                    mt-2
                    text-sm
                    text-gray-500
                ">
                    Enter the 6-digit code sent to
                </p>

                <p className="
                    mt-1
                    text-sm
                    font-medium
                    text-gray-900
                ">
                    {identifier}
                </p>

            </div>


            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={loading}
                />


                {otpError && (
                    <p className="
                        text-center
                        text-xs
                        text-red-500
                    ">
                        {otpError}
                    </p>
                )}


                {serverError && (
                    <p className="
                        text-center
                        text-xs
                        text-red-500
                    ">
                        {serverError}
                    </p>
                )}

               <div className="
                    text-center
                    text-sm
                ">

                    {resendTimer > 0 ? (

                        <p className="text-gray-500">
                            Resend OTP in{" "}
                            <span className="font-medium text-gray-900">
                                {resendTimer}s
                            </span>
                        </p>

                    ) : (

                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resending || loading}
                            className="
                                font-medium
                                text-gray-900
                                hover:underline
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {resending
                                ? "Sending..."
                                : "Resend OTP"
                            }
                        </button>

                    )}

                </div>


                <button
                    type="submit"
                    disabled={
                        loading ||
                        otp.length !== 6
                    }
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
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Logging in..."
                        : "Verify & Login"}
                </button>


                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                    className="
                        w-full
                        text-sm
                        font-medium
                        text-gray-500
                        hover:text-gray-900
                    "
                >
                    Use password instead
                </button>

            </form>

        </div>
    );
};


export default LoginOtp;