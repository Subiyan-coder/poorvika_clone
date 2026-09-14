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
    link,
    placement,
    status,
    startDate,
    endDate,
    priority
}) => {

    const formData = new FormData();

    formData.append("title", title);
    formData.append("image", image);
    formData.append("placement", placement);

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
        formData.append("priority", priority);
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
        link,
        placement,
        status,
        startDate,
        endDate,
        priority
    }
) => {

    const formData = new FormData();

    if (title !== undefined) {
        formData.append("title", title);
    }

    if (image) {
        formData.append("image", image);
    }

    if (link !== undefined) {
        formData.append("link", link);
    }

    if (placement !== undefined) {
        formData.append("placement", placement);
    }

    if (status !== undefined) {
        formData.append("status", status);
    }

    if (startDate !== undefined) {
        formData.append("startDate", startDate);
    }

    if (endDate !== undefined) {
        formData.append("endDate", endDate);
    }

    if (priority !== undefined) {
        formData.append("priority", priority);
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
    placement
) => {

    const response = await api.get(
        "/advertisements/active",
        {
            params: {
                placement
            }
        }
    );

    return response.data;
};