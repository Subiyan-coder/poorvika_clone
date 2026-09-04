const {getProfile, updateProfile, updateProfileImage} = require("../services/profileService");

const { logger } = require("../utils/logger");


const getUserProfile = async (req, res, next) => {

    try {

        const user = await getProfile(req.user.userId);

        return res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    }
    catch (err) {

        logger.error(`Get profile failed: ${err.message}`);

        next(err);
    }
};


const updateUserProfile = async (req, res, next) => {

    try {

        const user = await updateProfile(
            req.user.userId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    }
    catch (err) {

        logger.error(`Profile update failed: ${err.message}`);

        next(err);
    }
};

const updateUserProfileImage = async (req, res, next) => {
    try{
        const user = await updateProfileImage(
            req.user.userId,
            req.file
        );

        return res.status(200).json(
            {
                success : true,
                message : "Profile Image updated successfully",
                data : {
                    profileImage : user.profileImage
                }
            }
        );
    }
    catch(err){
        logger.error(`Profile Image update failed ${err.message}`);
        next(err);
    };
}




module.exports = {getUserProfile, updateUserProfile, updateUserProfileImage};