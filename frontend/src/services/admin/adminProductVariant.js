import api from "../api";


// -------------------------
// Product Variants
// -------------------------

export const getAdminProductVariants = async ({
    page,
    limit,
    search,
    status,
    sort,
    productId
}) => {

    const response = await api.get(
        "/product-variants/admin/all",
        {
            params: {
                page,
                limit,
                search,
                status,
                sort,
                productId
            }
        }
    );

    return response.data;
};


export const createProductVariant = async (
    data
) => {

    const response = await api.post(
        "/product-variants",
        data
    );

    return response.data;
};


export const updateProductVariant = async (
    variantId,
    data
) => {

    const response = await api.patch(
        `/product-variants/${variantId}`,
        data
    );

    return response.data;
};


export const updateProductVariantStatus = async (
    variantId,
    isActive
) => {

    const response = await api.patch(
        `/product-variants/${variantId}/status`,
        {
            isActive
        }
    );

    return response.data;
};


export const deleteProductVariant = async (
    variantId
) => {

    const response = await api.delete(
        `/product-variants/${variantId}`
    );

    return response.data;
};


// -------------------------
// Product Variant Images
// -------------------------

export const addProductVariantImages = async (
    variantId,
    files
) => {

    const formData = new FormData();

    files.forEach(file => {

        formData.append(
            "images",
            file
        );

    });


    const response = await api.post(
        `/product-variants/${variantId}/images`,
        formData
    );

    return response.data;
};


export const updateProductVariantImage = async (
    variantId,
    imageId,
    file
) => {

    const formData = new FormData();

    formData.append(
        "image",
        file
    );


    const response = await api.patch(
        `/product-variants/${variantId}/images/${imageId}`,
        formData
    );

    return response.data;
};


export const deleteProductVariantImage = async (
    variantId,
    imageId
) => {

    const response = await api.delete(
        `/product-variants/${variantId}/images/${imageId}`
    );

    return response.data;
};


export const getProductVariants = async (
    productId
) => {

    const response = await api.get(
        `/product-variants/product/${productId}`
    );

    return response.data;
};