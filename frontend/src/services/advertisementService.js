import api from "./api";



// =========================
// Get All Advertisements
// =========================

export const getAllAdvertisements = async () => {

    const response = await api.get(
        "/advertisements"
    );

    return response.data;
};



// =========================
// Create Advertisement
// =========================

export const createAdvertisement = async ({
    title,
    image,
    productVariantId,
    link,
    placement,
    section,
    status,
    startDate,
    endDate,
    priority
}) => {

    const formData = new FormData();

    formData.append("title", title);
    formData.append("image", image);
    formData.append("placement", placement);

    if (
        productVariantId !== undefined &&
        productVariantId !== null &&
        productVariantId !== ""
    ) {
        formData.append(
            "productVariantId",
            productVariantId
        );
    }

    if (
        section !== undefined &&
        section !== null
    ) {
        formData.append(
            "section",
            section
        );
    }

    if (link) {
        formData.append("link", link);
    }

    if (status) {
        formData.append("status", status);
    }

    if (startDate) {
        formData.append("startDate", startDate);
    }

    if (endDate) {
        formData.append("endDate", endDate);
    }

    if (priority !== undefined) {
        formData.append(
            "priority",
            priority
        );
    }

    const response = await api.post(
        "/advertisements",
        formData
    );

    return response.data;
};



// =========================
// Update Advertisement
// =========================

export const updateAdvertisement = async (
    advertisementId,
    {
        title,
        image,
        productVariantId,
        link,
        placement,
        section,
        status,
        startDate,
        endDate,
        priority
    }
) => {

    const formData = new FormData();

    if (title !== undefined) {
        formData.append(
            "title",
            title
        );
    }

    if (image) {
        formData.append(
            "image",
            image
        );
    }

    if (productVariantId !== undefined) {
        formData.append(
            "productVariantId",
            productVariantId || ""
        );
    }

    if (link !== undefined) {
        formData.append(
            "link",
            link
        );
    }

    if (placement !== undefined) {
        formData.append(
            "placement",
            placement
        );
    }

    if (section !== undefined) {
        formData.append(
            "section",
            section || ""
        );
    }

    if (status !== undefined) {
        formData.append(
            "status",
            status
        );
    }

    if (startDate !== undefined) {
        formData.append(
            "startDate",
            startDate
        );
    }

    if (endDate !== undefined) {
        formData.append(
            "endDate",
            endDate
        );
    }

    if (priority !== undefined) {
        formData.append(
            "priority",
            priority
        );
    }

    const response = await api.patch(
        `/advertisements/${advertisementId}`,
        formData
    );

    return response.data;
};



// =========================
// Delete Advertisement
// =========================

export const deleteAdvertisement = async (
    advertisementId
) => {

    const response = await api.delete(
        `/advertisements/${advertisementId}`
    );

    return response.data;
};



// =========================
// Get Active Advertisements
// =========================

export const getActiveAdvertisements = async (
    placement,
    section
) => {

    const response = await api.get(
        "/advertisements/active",
        {
            params: {
                placement,
                section
            }
        }
    );

    return response.data;
};