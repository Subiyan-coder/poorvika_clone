import api from "../api";


export const getAdminShipments = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sort = "newest"
} = {}) => {

    const response = await api.get(
        "/shipments/admin/all",
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


export const getAdminShipment = async (
    orderId
) => {

    const response = await api.get(
        `/shipments/admin/${orderId}`
    );

    return response.data;
};


export const updateAdminShipment = async (
    shipmentId,
    {
        status,
        carrier,
        trackingNumber
    }
) => {

    const response = await api.patch(
        `/shipments/admin/${shipmentId}`,
        {
            status,
            carrier,
            trackingNumber
        }
    );

    return response.data;
};