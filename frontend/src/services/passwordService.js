import api from "./api";


// =========================
// Create Password
// =========================

export const createPassword = async (
    password
) => {

    const response = await api.post(
        "/password",
        {
            password
        }
    );

    return response.data;
};


// =========================
// Change Password
// =========================

export const changePassword = async (
    currentPassword,
    newPassword
) => {

    const response = await api.patch(
        "/password",
        {
            currentPassword,
            newPassword
        }
    );

    return response.data;
};


// =========================
// Request Password Reset OTP
// =========================

export const requestPasswordResetOtp = async (
    data
) => {

    const response = await api.post(
        "/password/reset/request-otp",
        data
    );

    return response.data;
};


// =========================
// Reset Password
// =========================

export const resetPassword = async (
    data
) => {

    const response = await api.post(
        "/password/reset",
        data
    );

    return response.data;
};