import api from "../api";


export const getCustomerProducts = async ({
    categoryId,
    page = 1,
    limit = 20
} = {}) => {

    const response = await api.get(
        "/products",
        {
            params: {
                categoryId,
                page,
                limit
            }
        }
    );

    return response.data;
};