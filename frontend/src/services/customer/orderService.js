import api from "../api";


export const createCustomerDirectOrder = async ({
    productVariantId,
    quantity,
    addressId
}) => {

    const response = await api.post(
        "/order/buy-now",
        {
            productVariantId,
            quantity,
            addressId
        }
    );

    return response.data;
};



export const createCustomerCartOrder = async ({
    addressId
}) => {

    const response = await api.post(
        "/order/cart",
        {
            addressId
        }
    );

    return response.data;
};


export const getCustomerOrders = async () => {

    const response = await api.get(
        "/order"
    );

    return response.data;
};


export const getCustomerOrder = async (
    orderId
) => {

    const response = await api.get(
        `/order/${orderId}`
    );

    return response.data;
};
