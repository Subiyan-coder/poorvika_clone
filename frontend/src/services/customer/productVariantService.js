import api from "../api";


export const getCustomerProductVariant = async (
    variantId
) => {

    const response = await api.get(
        `/product-variants/${variantId}`
    );

    return response.data;
};