import api from "./api";


export const requestRegistrationOtp = async ({
    identifier,
    type
}) => {

    const response = await api.post(
        "/auth/registration-otp",
        {
            identifier,
            type
        }
    );

    return response.data;
};


export const verifyRegistrationOtp = async ({
    identifier,
    type,
    otp
}) => {

    const response = await api.post(
        "/auth/verify-account-otp",
        {
            identifier,
            type,
            otp
        }
    );

    return response.data;
};


export const register = async ({
    name,
    email,
    phone,
    password,
    verifiedIdentifier,
    verifiedType
}) => {

    const response = await api.post(
        "/auth/register",
        {
            name,
            email,
            phone,
            password,
            verifiedIdentifier,
            verifiedType
        }
    );

    return response.data;
};

export const requestLoginOtp = async ({
    identifier,
    type
}) => {

    const response = await api.post(
        "/auth/login-request-otp",
        {
            identifier,
            type
        }
    );

    return response.data;
};


export const login = async ({
    identifier,
    type,
    password,
    otp
}) => {

    const payload = {
        identifier,
        type
    };

    if (password) {
        payload.password = password;
    }

    if (otp) {
        payload.otp = otp;
    }

    const response = await api.post(
        "/auth/login",
        payload
    );

    return response.data;
};


export const getCurrentUser = async () => {

    const response = await api.get(
        "/auth/me"
    );

    return response.data;
};