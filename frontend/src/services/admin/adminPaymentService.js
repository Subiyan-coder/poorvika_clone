import api from "../api";


export const getAdminPayments = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    method = "",
    sort = "newest"
} = {}) => {

    const response =
        await api.get(
            "/payments/admin/all",
            {
                params: {
                    page,
                    limit,
                    search,
                    status,
                    method,
                    sort
                }
            }
        );


    return response.data;
};