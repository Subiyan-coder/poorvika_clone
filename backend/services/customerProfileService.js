const User = require("../models/user");
const {uploadImage, deleteImage} = require("./cloudinaryService");

const getProfile = async (userId) => {

    const user = await User.findById(userId).select(
        "name email phone role isVerified createdAt updatedAt"
    );

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};


const updateProfile = async (userId, { name }) => {

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (name !== undefined) {
        user.name = name;
    }

    await user.save();

    return user;
};

const updateProfileImage = async (userId, file) => {

    if(!file) {
        const error = new Error("profile Image is required");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(userId).select("profileImage");

    if(!user){
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const oldPublicId = user.profileImage?.publicId;

    const uploadedImage = await uploadImage(
        file.buffer,
        "poorvika/customers/profile"
    );

    user.profileImage = {
        url : uploadedImage.url,
        publicId : uploadedImage.publicId
    };

    await user.save();

    if(oldPublicId){
        deleteImage(oldPublicId);
    }
};


module.exports = {getProfile, updateProfile, updateProfileImage};