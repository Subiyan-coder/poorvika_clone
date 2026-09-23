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

const deleteImage = async (
    publicId
) => {

    if (!publicId) {
        return;
    }


    // Check whether an existing order
    // still references this image.
    const orderUsesImage =
        await Order.exists({
            "items.productImage.publicId":
                publicId
        });


    if (orderUsesImage) {

        console.log(
            `Cloudinary image retained because it is referenced by an order: ${publicId}`
        );

        return {
            deleted: false,
            retained: true,
            reason: "IMAGE_USED_BY_ORDER"
        };
    }


    // No order references it,
    // so it is safe to delete.
    const result =
        await cloudinary.uploader.destroy(
            publicId
        );


    return {
        deleted:
            result.result === "ok",

        retained: false,

        result: result.result
    };
};

module.exports = {uploadImage, deleteImage};