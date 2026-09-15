import api from "./api";


// =========================
// Get All Addresses
// =========================

export const getAllAddresses = async () => {

    const response = await api.get(
        "/addresses"
    );

    return response.data;
};


// =========================
// Get One Address
// =========================

export const getAddress = async (
    addressId
) => {

    const response = await api.get(
        `/addresses/${addressId}`
    );

    return response.data;
};


// =========================
// Create Address
// =========================

export const createAddress = async (
    addressData
) => {

    const response = await api.post(
        "/addresses",
        addressData
    );

    return response.data;
};


// =========================
// Update Address
// =========================

export const updateAddress = async (
    addressId,
    addressData
) => {

    const response = await api.patch(
        `/addresses/${addressId}`,
        addressData
    );

    return response.data;
};


// =========================
// Delete Address
// =========================

export const deleteAddress = async (
    addressId
) => {

    const response = await api.delete(
        `/addresses/${addressId}`
    );

    return response.data;
};


// =========================
// Set Default Address
// =========================

export const setDefaultAddress = async (
    addressId
) => {

    const response = await api.patch(
        `/addresses/${addressId}/default`
    );

    return response.data;
};