import api from "./api";


// =========================
// Get Profile
// =========================

export const getProfile = async () => {

    const response = await api.get(
        "/profile"
    );

    return response.data;
};


// =========================
// Update Profile
// =========================

export const updateProfile = async (
    profileData
) => {

    const response = await api.patch(
        "/profile",
        profileData
    );

    return response.data;
};


// =========================
// Update Profile Picture
// =========================

export const updateProfileImage = async (
    image
) => {

    const formData = new FormData();

    formData.append(
        "profileImage",
        image
    );

    const response = await api.patch(
        "/profile/picture",
        formData
    );

    return response.data;
};