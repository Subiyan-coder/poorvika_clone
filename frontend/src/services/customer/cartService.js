import api from "../api";


export const getCustomerCart = async () => {

    const response = await api.get(
        "/cart"
    );

    return response.data;
};


export const addCustomerCartItem = async ({
    productVariantId,
    quantity = 1
}) => {

    const response = await api.post(
        "/cart/items",
        {
            productVariantId,
            quantity
        }
    );

    return response.data;
};


export const updateCustomerCartItem = async ({
    productVariantId,
    quantity
}) => {

    const response = await api.patch(
        `/cart/items/${productVariantId}`,
        {
            quantity
        }
    );

    return response.data;
};


export const toggleCustomerCartItem = async ({
    productVariantId,
    selected
}) => {

    const response = await api.patch(
        `/cart/items/${productVariantId}/selection`,
        {
            selected
        }
    );

    return response.data;
};


export const removeCustomerCartItem = async (
    productVariantId
) => {

    const response = await api.delete(
        `/cart/items/${productVariantId}`
    );

    return response.data;
};


export const clearCustomerCart = async () => {

    const response = await api.delete(
        "/cart"
    );

    return response.data;
};