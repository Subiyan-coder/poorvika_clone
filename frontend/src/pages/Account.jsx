import { useState, useEffect } from "react";

import OtpInput from "../components/OtpInput";

import {
    requestEmailChangeOtp,
    changeEmail,
    requestPhoneChangeOtp,
    changePhone
} from "../services/accountService";

import {
    toastSuccess
} from "../utils/toast";


const Account = () => {

    const [activeType, setActiveType] = useState(null);

    const [value, setValue] = useState("");
    const [otp, setOtp] = useState("");

    const [step, setStep] = useState("INPUT");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const [resendTimer, setResendTimer] = useState(60);


    /* =========================
       OTP TIMER
    ========================= */

    useEffect(() => {

        if (step !== "OTP") {
            return;
        }

        if (resendTimer <= 0) {
            return;
        }

        const timer = setInterval(() => {

            setResendTimer(
                previous => previous - 1
            );

        }, 1000);

        return () => clearInterval(timer);

    }, [step, resendTimer]);


    /* =========================
       OPEN CHANGE
    ========================= */

    const openChange = (type) => {

        setActiveType(type);
        setValue("");
        setOtp("");
        setStep("INPUT");
        setError("");
        setResendTimer(60);
    };


    /* =========================
       VALIDATION
    ========================= */

    const validateValue = () => {

        const trimmedValue = value.trim();

        if (!trimmedValue) {

            setError(
                activeType === "EMAIL"
                    ? "Email is required"
                    : "Phone number is required"
            );

            return false;
        }


        if (activeType === "EMAIL") {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(trimmedValue)) {

                setError(
                    "Enter a valid email address"
                );

                return false;
            }
        }


        if (activeType === "PHONE") {

            const phoneRegex =
                /^[6-9]\d{9}$/;

            if (!phoneRegex.test(trimmedValue)) {

                setError(
                    "Enter a valid 10-digit phone number"
                );

                return false;
            }
        }


        setError("");

        return true;
    };


    /* =========================
       REQUEST OTP
    ========================= */

    const handleRequestOtp = async (event) => {

        event.preventDefault();

        if (!validateValue()) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            if (activeType === "EMAIL") {

                await requestEmailChangeOtp(
                    value.trim()
                );

            }
            else {

                await requestPhoneChangeOtp(
                    value.trim()
                );

            }

            setOtp("");
            setResendTimer(60);
            setStep("OTP");

            toastSuccess(
                "Verification OTP sent successfully"
            );

        }
        catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to send OTP. Please try again."
            );

        }
        finally {

            setLoading(false);

        }
    };


    /* =========================
       VERIFY OTP
    ========================= */

    const handleVerifyOtp = async (event) => {

        event.preventDefault();

        if (otp.length !== 6) {

            setError(
                "OTP must be 6 digits"
            );

            return;
        }

        try {

            setLoading(true);
            setError("");

            if (activeType === "EMAIL") {

                await changeEmail(
                    value.trim(),
                    otp
                );

            }
            else {

                await changePhone(
                    value.trim(),
                    otp
                );

            }

            toastSuccess(
                activeType === "EMAIL"
                    ? "Email changed successfully"
                    : "Phone number changed successfully"
            );

            setActiveType(null);
            setValue("");
            setOtp("");
            setStep("INPUT");

        }
        catch (error) {

            setError(
                error.response?.data?.message ||
                "OTP verification failed. Please try again."
            );

        }
        finally {

            setLoading(false);

        }
    };


    /* =========================
       RESEND OTP
    ========================= */

    const handleResendOtp = async () => {

        if (
            resendTimer > 0 ||
            resending
        ) {
            return;
        }

        try {

            setResending(true);
            setError("");

            if (activeType === "EMAIL") {

                await requestEmailChangeOtp(
                    value.trim()
                );

            }
            else {

                await requestPhoneChangeOtp(
                    value.trim()
                );

            }

            setOtp("");
            setResendTimer(60);

            toastSuccess(
                "A new OTP has been sent"
            );

        }
        catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to resend OTP. Please try again."
            );

        }
        finally {

            setResending(false);

        }
    };


    /* =========================
       CHANGE VALUE
    ========================= */

    const handleValueChange = (event) => {

        setValue(event.target.value);
        setError("");

    };


    /* =========================
       ACCOUNT VIEW
    ========================= */

    return (
        <div className="
            min-h-screen
            bg-gray-50
            px-4
            py-10
            sm:px-6
        ">

            <div className="
                mx-auto
                w-full
                max-w-3xl
            ">

                <div className="mb-8">

                    <h1 className="
                        text-3xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                    ">
                        Account
                    </h1>

                    <p className="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        Manage your email address and
                        phone number.
                    </p>

                </div>


                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                ">

                    {/* Email */}

                    <button
                        type="button"
                        onClick={() =>
                            openChange("EMAIL")
                        }
                        className="
                            flex
                            w-full
                            items-center
                            justify-between
                            border-b
                            border-gray-200
                            px-6
                            py-5
                            text-left
                            transition
                            hover:bg-gray-50
                        "
                    >

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-900
                            ">
                                Change email
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                                Update your account email
                                using OTP verification.
                            </p>

                        </div>

                        <span className="
                            text-sm
                            text-gray-400
                        ">
                            →
                        </span>

                    </button>


                    {/* Phone */}

                    <button
                        type="button"
                        onClick={() =>
                            openChange("PHONE")
                        }
                        className="
                            flex
                            w-full
                            items-center
                            justify-between
                            px-6
                            py-5
                            text-left
                            transition
                            hover:bg-gray-50
                        "
                    >

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-900
                            ">
                                Change phone number
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                                Update your phone number
                                using OTP verification.
                            </p>

                        </div>

                        <span className="
                            text-sm
                            text-gray-400
                        ">
                            →
                        </span>

                    </button>

                </div>

            </div>


            {/* =========================
                CHANGE MODAL
            ========================= */}

            {activeType && (

                <div className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    px-4
                ">

                    <div className="
                        relative
                        w-full
                        max-w-md
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-2xl
                    ">

                        {/* Close */}

                        <button
                            type="button"
                            onClick={() =>
                                setActiveType(null)
                            }
                            disabled={loading}
                            className="
                                absolute
                                right-5
                                top-5
                                text-xl
                                text-gray-400
                                hover:text-gray-900
                            "
                        >
                            ×
                        </button>


                        {step === "INPUT" ? (

                            <>
                                <div className="mb-7">

                                    <h2 className="
                                        text-2xl
                                        font-semibold
                                        text-gray-900
                                    ">
                                        Change{" "}
                                        {activeType === "EMAIL"
                                            ? "email"
                                            : "phone number"}
                                    </h2>

                                    <p className="
                                        mt-2
                                        text-sm
                                        text-gray-500
                                    ">
                                        Enter your new{" "}
                                        {activeType === "EMAIL"
                                            ? "email address"
                                            : "phone number"}.
                                        We'll send an OTP to
                                        verify it.
                                    </p>

                                </div>


                                <form
                                    onSubmit={
                                        handleRequestOtp
                                    }
                                    className="space-y-5"
                                >

                                    <div>

                                        <label className="
                                            mb-2
                                            block
                                            text-sm
                                            font-medium
                                            text-gray-700
                                        ">
                                            {activeType === "EMAIL"
                                                ? "New email"
                                                : "New phone number"}
                                        </label>

                                        <input
                                            type={
                                                activeType === "EMAIL"
                                                    ? "email"
                                                    : "tel"
                                            }
                                            value={value}
                                            onChange={
                                                handleValueChange
                                            }
                                            placeholder={
                                                activeType === "EMAIL"
                                                    ? "Enter new email"
                                                    : "Enter new phone number"
                                            }
                                            disabled={loading}
                                            className="
                                                h-12
                                                w-full
                                                rounded-xl
                                                border
                                                border-gray-300
                                                bg-white
                                                px-4
                                                text-sm
                                                text-gray-900
                                                outline-none
                                                transition
                                                placeholder:text-gray-400
                                                focus:border-gray-900
                                                focus:ring-2
                                                focus:ring-gray-100
                                            "
                                        />

                                    </div>


                                    {error && (
                                        <p className="
                                            text-sm
                                            text-red-500
                                        ">
                                            {error}
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
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {loading
                                            ? "Sending OTP..."
                                            : "Send OTP"}
                                    </button>

                                </form>
                            </>

                        ) : (

                            <>
                                <div className="mb-7">

                                    <h2 className="
                                        text-2xl
                                        font-semibold
                                        text-gray-900
                                    ">
                                        Verify your{" "}
                                        {activeType === "EMAIL"
                                            ? "email"
                                            : "phone"}
                                    </h2>

                                    <p className="
                                        mt-2
                                        text-sm
                                        text-gray-500
                                    ">
                                        Enter the 6-digit OTP
                                        sent to
                                    </p>

                                    <p className="
                                        mt-1
                                        break-all
                                        text-sm
                                        font-medium
                                        text-gray-900
                                    ">
                                        {value}
                                    </p>

                                </div>


                                <form
                                    onSubmit={
                                        handleVerifyOtp
                                    }
                                    className="space-y-6"
                                >

                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        disabled={loading}
                                    />


                                    {error && (
                                        <p className="
                                            text-center
                                            text-sm
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

                                            <p className="
                                                text-gray-500
                                            ">
                                                Resend OTP in{" "}
                                                <span className="
                                                    font-medium
                                                    text-gray-900
                                                ">
                                                    {resendTimer}s
                                                </span>
                                            </p>

                                        ) : (

                                            <button
                                                type="button"
                                                onClick={
                                                    handleResendOtp
                                                }
                                                disabled={
                                                    resending ||
                                                    loading
                                                }
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
                                            : "Verify & Update"}
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep("INPUT");
                                            setOtp("");
                                            setError("");
                                        }}
                                        disabled={loading}
                                        className="
                                            w-full
                                            text-sm
                                            font-medium
                                            text-gray-500
                                            hover:text-gray-900
                                        "
                                    >
                                        Use a different{" "}
                                        {activeType === "EMAIL"
                                            ? "email"
                                            : "phone number"}
                                    </button>

                                </form>
                            </>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
};


export default Account;