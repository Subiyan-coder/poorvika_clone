import api from "../api";


export const getCustomerCategories = async () => {

    const response = await api.get(
        "/categories"
    );

    return response.data;
};