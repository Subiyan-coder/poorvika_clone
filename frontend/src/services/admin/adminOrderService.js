import api from "../api";


export const getAdminOrders = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sort = "newest"
} = {}) => {

    const response = await api.get(
        "/order/admin/all",
        {
            params: {
                page,
                limit,
                search,
                status,
                sort
            }
        }
    );

    return response.data;
};


export const getAdminOrder = async (
    orderId
) => {

    const response = await api.get(
        `/order/admin/${orderId}`
    );

    return response.data;
};