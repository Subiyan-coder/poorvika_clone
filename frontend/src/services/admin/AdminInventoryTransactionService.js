import api from "../api";


// -------------------------
// Inventory Transactions
// -------------------------

export const getAdminInventoryTransactions = async ({
    page,
    limit,
    search,
    source,
    type,
    performedBy,
    productId,
    sort
}) => {

    const response = await api.get(
        "/inventory-transactions",
        {
            params: {
                page,
                limit,
                search,
                source,
                type,
                performedBy,
                productId,
                sort
            }
        }
    );

    return response.data;
};