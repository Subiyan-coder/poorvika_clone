import api from "../api";


export const getAdminCategories = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "ALL",
    sort = "NEWEST"
} = {}) => {

    const response = await api.get(
        "/categories/admin/all",
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


export const createCategory = async (data) => {

    const response = await api.post(
        "/categories",
        data
    );

    return response.data;
};


export const updateCategory = async (
    categoryId,
    data
) => {

    const response = await api.patch(
        `/categories/${categoryId}`,
        data
    );

    return response.data;
};


export const updateCategoryStatus = async (
    categoryId,
    isActive
) => {

    const response = await api.patch(
        `/categories/${categoryId}/status`,
        {
            isActive
        }
    );

    return response.data;
};


export const deleteCategory = async (
    categoryId
) => {

    const response = await api.delete(
        `/categories/${categoryId}`
    );

    return response.data;
};