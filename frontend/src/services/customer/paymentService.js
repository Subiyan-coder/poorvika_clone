import api from "../api";


// =========================
// Create Payment
// =========================

export const createCustomerPayment = async ({
    orderId,
    method
}) => {

    const response = await api.post(
        "/payments",
        {
            orderId,
            method
        }
    );

    return response.data;
};


// =========================
// Get My Payment
// =========================

export const getCustomerPayment = async (
    orderId
) => {

    const response = await api.get(
        `/payments/${orderId}`
    );

    return response.data;
};


// =========================
// Start Online Payment
// =========================

export const startCustomerOnlinePayment = async (
    orderId
) => {

    const response = await api.post(
        `/payments/${orderId}/start`
    );

    return response.data;
};