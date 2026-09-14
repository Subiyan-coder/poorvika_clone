import api from "../api";

// -------------------------
// Inventory
// -------------------------

export const getAdminInventory = async () => {

    const response = await api.get(
        "/inventory"
    );

    return response.data;
};


export const getInventory = async (
    productVariantId
) => {

    const response = await api.get(
        `/inventory/${productVariantId}`
    );

    return response.data;
};


export const adjustInventory = async (
    productVariantId,
    data
) => {

    const response = await api.patch(
        `/inventory/${productVariantId}/adjust`,
        data
    );

    return response.data;
};


export const updateInventoryAvailability = async (
    productVariantId,
    isAvailable
) => {

    const response = await api.patch(
        `/inventory/${productVariantId}/availability`,
        {
            isAvailable
        }
    );

    return response.data;
};