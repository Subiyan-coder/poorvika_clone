import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toastSuccess } from "../utils/toast";
import OtpInput from "../components/OtpInput";

import {
    verifyRegistrationOtp,
    requestRegistrationOtp
} from "../services/authService";


const VerifyOtp = () => {

    const location = useLocation();
    const navigate = useNavigate();


    const {
        identifier,
        type
    } = location.state || {};


    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
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
                    Verification session expired
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
                    onClick={() => navigate("/register")}
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

    const handleOtpChange = (value) => {

        setOtp(value);

        if (!value) {
            setError("");
            return;
        }

        if (value.length < 6) {
            setError("OTP must be 6 digits");
            return;
        }

        setError("");
    };

    const handleResendOtp = async () => {

        if (resendTimer > 0 || resending) {
            return;
        }

        try {

            setResending(true);
            setError("");

            await requestRegistrationOtp({
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

            setError(
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

        setError("");

        if (otp.length !== 6) {
            setError("OTP must be 6 digits");
            return;
        }

        try {

            setLoading(true);

            await verifyRegistrationOtp({
                identifier,
                type,
                otp
            });

            navigate("/register/details", {
                state: {
                    identifier,
                    type,
                    verified: true
                }
            });

        }
        catch (err) {

            setError(
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


                {error && (
                    <p className="
                        text-center
                        text-xs
                        text-red-500
                    ">
                        {error}
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
                        ? "Verifying..."
                        : "Verify OTP"}
                </button>
                

                <button
                    type="button"
                    onClick={() => navigate("/register")}
                    disabled={loading}
                    className="
                        w-full
                        text-sm
                        font-medium
                        text-gray-500
                        hover:text-gray-900
                    "
                >
                    Use a different {type === "EMAIL"
                        ? "email"
                        : "phone"}
                </button>

            </form>

        </div>
    );
};


export default VerifyOtp;