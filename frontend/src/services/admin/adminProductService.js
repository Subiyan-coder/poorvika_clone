import api from "../api";


export const getAdminProducts = async ({
    page,
    limit,
    search,
    status,
    sort,
    categoryId
}) => {

    const response = await api.get(
        "/products/admin/all",
        {
            params: {
                page,
                limit,
                search,
                status,
                sort,
                categoryId
            }
        }
    );

    return response.data;
};


export const createProduct = async (data) => {

    const response = await api.post(
        "/products",
        data
    );

    return response.data;
};


export const updateProduct = async (
    productId,
    data
) => {

    const response = await api.patch(
        `/products/${productId}`,
        data
    );

    return response.data;
};


export const updateProductStatus = async (
    productId,
    isActive
) => {

    const response = await api.patch(
        `/products/${productId}/status`,
        {
            isActive
        }
    );

    return response.data;
};


export const deleteProduct = async (
    productId
) => {

    const response = await api.delete(
        `/products/${productId}`
    );

    return response.data;
};


// -------------------------
// Product Images
// -------------------------

export const addProductImages = async (
    productId,
    files
) => {

    const formData = new FormData();

    files.forEach(file => {
        formData.append("images", file);
    });


    const response = await api.post(
        `/products/${productId}/images`,
        formData
    );

    return response.data;
};


export const updateProductImage = async (
    productId,
    imageId,
    file
) => {

    const formData = new FormData();

    formData.append(
        "image",
        file
    );


    const response = await api.patch(
        `/products/${productId}/images/${imageId}`,
        formData
    );

    return response.data;
};


export const deleteProductImage = async (
    productId,
    imageId
) => {

    const response = await api.delete(
        `/products/${productId}/images/${imageId}`
    );

    return response.data;
};