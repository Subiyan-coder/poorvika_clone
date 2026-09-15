import api from "./api";


// =========================
// Get Admins
// =========================

export const getAdmins = async () => {

    const response = await api.get(
        "/account/admins"
    );

    return response.data;
};


// =========================
// Request Email Change OTP
// =========================

export const requestEmailChangeOtp = async (
    email
) => {

    const response = await api.post(
        "/account/email/request-otp",
        {
            email
        }
    );

    return response.data;
};


// =========================
// Verify Email Change
// =========================

export const changeEmail = async (
    email,
    otp
) => {

    const response = await api.patch(
        "/account/email",
        {
            email,
            otp
        }
    );

    return response.data;
};


// =========================
// Request Phone Change OTP
// =========================

export const requestPhoneChangeOtp = async (
    phone
) => {

    const response = await api.post(
        "/account/phone/request-otp",
        {
            phone
        }
    );

    return response.data;
};


// =========================
// Verify Phone Change
// =========================

export const changePhone = async (
    phone,
    otp
) => {

    const response = await api.patch(
        "/account/phone",
        {
            phone,
            otp
        }
    );

    return response.data;
};