const {cloudinary} = require("../config/cloudinary");

const uploadImage = async (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {folder},

            (error, result) => {
                if(error){
                    return reject(error);
                }

                resolve(
                    {
                        url : result.secure_url,
                        publicId : result.public_id
                    }
                );
            }
        );

        uploadStream.end(fileBuffer);
    })
};

const deleteImage = async (publicId) => {

    if(!publicId){
        return;
    }

    return cloudinary.uploader.destroy(publicId);
};

module.exports = {uploadImage, deleteImage};