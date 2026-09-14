const Advertisement = require("../models/advertisement");

const {
    uploadImage,
    deleteImage
} = require("./cloudinaryService");


// =========================
// Create Advertisement
// =========================

const createAdvertisement = async ({
    title,
    imageFile,
    link,
    placement,
    status,
    startDate,
    endDate,
    priority,
    createdBy
}) => {

    if (!imageFile) {

        const error = new Error(
            "Advertisement image is required"
        );

        error.statusCode = 400;

        throw error;
    }


    const image = await uploadImage(
        imageFile.buffer,
        "poorvika/advertisements"
    );


    try {

        const advertisement =
            await Advertisement.create({

                title,

                image: {
                    url: image.url,
                    publicId: image.publicId
                },

                link: link || null,

                placement,

                status: status || "INACTIVE",

                startDate:
                    startDate || null,

                endDate:
                    endDate || null,

                priority:
                    priority || 0,

                createdBy

            });


        return advertisement;

    }
    catch (error) {

        // If MongoDB creation fails,
        // remove the already uploaded image.

        await deleteImage(
            image.publicId
        );

        throw error;

    }
};


// =========================
// Update Advertisement
// =========================

const updateAdvertisement = async (
    advertisementId,
    {
        title,
        imageFile,
        link,
        placement,
        status,
        startDate,
        endDate,
        priority
    }
) => {

    const advertisement =
        await Advertisement.findById(
            advertisementId
        );


    if (!advertisement) {

        const error = new Error(
            "Advertisement not found"
        );

        error.statusCode = 404;

        throw error;
    }


    const oldPublicId =
        advertisement.image.publicId;


    if (title !== undefined) {
        advertisement.title = title;
    }


    if (link !== undefined) {
        advertisement.link = link || null;
    }


    if (placement !== undefined) {
        advertisement.placement = placement;
    }


    if (status !== undefined) {
        advertisement.status = status;
    }


    if (startDate !== undefined) {
        advertisement.startDate =
            startDate || null;
    }


    if (endDate !== undefined) {
        advertisement.endDate =
            endDate || null;
    }


    if (priority !== undefined) {
        advertisement.priority =
            priority;
    }


    let newImage = null;


    // Replace image only when
    // a new image was uploaded.

    if (imageFile) {

        newImage = await uploadImage(
            imageFile.buffer,
            "poorvika/advertisements"
        );


        advertisement.image = {
            url: newImage.url,
            publicId: newImage.publicId
        };
    }


    try {

        await advertisement.save();

    }
    catch (error) {

        // MongoDB update failed.
        // Remove newly uploaded image.

        if (newImage) {

            await deleteImage(
                newImage.publicId
            );

        }

        throw error;
    }


    // Delete old Cloudinary image
    // only after successful DB update.

    if (newImage && oldPublicId) {

        await deleteImage(
            oldPublicId
        );

    }


    return advertisement;
};


// =========================
// Delete Advertisement
// =========================

const deleteAdvertisement = async (
    advertisementId
) => {

    const advertisement =
        await Advertisement.findById(
            advertisementId
        );


    if (!advertisement) {

        const error = new Error(
            "Advertisement not found"
        );

        error.statusCode = 404;

        throw error;
    }


    await Advertisement.findByIdAndDelete(
        advertisementId
    );


    await deleteImage(
        advertisement.image.publicId
    );


    return {
        message:
            "Advertisement deleted successfully"
    };
};


// =========================
// Get Active Advertisements
// =========================

const getActiveAdvertisements = async (
    placement
) => {

    const now = new Date();


    const advertisements =
        await Advertisement.find({

            placement,

            status: "ACTIVE",

            $and: [

                {
                    $or: [
                        {
                            startDate: null
                        },
                        {
                            startDate: {
                                $lte: now
                            }
                        }
                    ]
                },

                {
                    $or: [
                        {
                            endDate: null
                        },
                        {
                            endDate: {
                                $gte: now
                            }
                        }
                    ]
                }

            ]

        })
        .sort({
            priority: -1,
            createdAt: -1
        })
        .lean();


    return advertisements;
};


// =========================
// Get All Advertisements
// =========================

const getAllAdvertisements = async () => {

    return Advertisement.find()
        .populate(
            "createdBy",
            "name email"
        )
        .sort({
            createdAt: -1
        })
        .lean();
};


module.exports = {

    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    getActiveAdvertisements,
    getAllAdvertisements

};