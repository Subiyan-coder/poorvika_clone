import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeft } from "lucide-react";

import PasswordInput from "../components/PasswordInput";
import { changePasswordSchema } from "../validations/authValidation";

import {
    changePassword
} from "../services/passwordService";

import {
    toastSuccess
} from "../utils/toast";


const ChangePassword = ({ onClose }) => {

    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        },
        reset
    } = useForm({
        resolver: zodResolver(
            changePasswordSchema
        ),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });


    const onSubmit = async (data) => {

        setServerError("");

        try {

            await changePassword({
                currentPassword:
                    data.currentPassword,

                newPassword:
                    data.newPassword
            });

            toastSuccess(
                "Password changed successfully"
            );

            reset();

            if (onClose) {
                onClose();
            }

        }
        catch (error) {

            setServerError(
                error.response?.data?.message ||
                "Unable to change password. Please try again."
            );

        }
    };


    return (
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
                    onClick={() => navigate("/profile")}
                    className="
                        mb-6
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-gray-500
                        transition
                        hover:text-gray-900
                    "
                >
                    <ArrowLeft size={18} />

                    Back to Profile
                </button>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="
                            absolute
                            right-4
                            top-4
                            text-xl
                            text-gray-400
                            hover:text-gray-900
                            disabled:opacity-50
                        "
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}


                <div className="mb-7">

                    <h2 className="
                        text-2xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                    ">
                        Change password
                    </h2>

                    <p className="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        Enter your current password and
                        choose a new password.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    {/* Current Password */}

                    <PasswordInput
                        id="currentPassword"
                        name="currentPassword"
                        label="Current password"
                        placeHolder="Enter your current password"
                        register={register}
                        error={errors.currentPassword}
                        showValidation={false}
                    />


                    {/* New Password */}

                    <PasswordInput
                        id="newPassword"
                        name="newPassword"
                        label="New password"
                        placeHolder="Enter your new password"
                        register={register}
                        error={errors.newPassword}
                        showValidation={true}
                    />


                    {/* Confirm Password */}

                    <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm new password"
                        placeHolder="Re-enter your new password"
                        register={register}
                        error={errors.confirmPassword}
                        showValidation={false}
                    />


                    {/* Server Error */}

                    {serverError && (
                        <p className="
                            text-sm
                            text-red-500
                        ">
                            {serverError}
                        </p>
                    )}


                    <button
                        type="submit"
                        disabled={isSubmitting}
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
                        {isSubmitting
                            ? "Changing password..."
                            : "Change password"
                        }
                    </button>


                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="
                                w-full
                                text-sm
                                font-medium
                                text-gray-500
                                hover:text-gray-900
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>
                    )}

                </form>

            </div>

        </div>
    );
};


export default ChangePassword;