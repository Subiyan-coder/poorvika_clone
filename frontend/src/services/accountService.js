import api from "./api";

export const getAdmins = async () => {

    const response = await api.get(
        "/customer/account/admins"
    );

    return response.data;

};