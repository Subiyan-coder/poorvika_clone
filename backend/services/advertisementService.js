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
    productVariantId,
    link,
    placement,
    section,
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

    if (placement === "HOME" && !section) {

        const error = new Error(
            "Section is required for HOME advertisements"
        );

        error.statusCode = 400;

        throw error;
    }

    if (placement !== "HOME") {
        section = null;
    }


    try {

        const advertisement =
            await Advertisement.create({

                title,

                image: {
                    url: image.url,
                    publicId: image.publicId
                },

                productVariantId: productVariantId || null,

                link: link || null,

                placement,

                section: section,

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

        await deleteImage(
            image.publicId
        );

        throw error;

    }
};



const updateAdvertisement = async (
    advertisementId,
    {
        title,
        imageFile,
        link,
        productVariantId,
        placement,
        section,
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

    if (productVariantId !== undefined) {
        advertisement.productVariantId =
            productVariantId || null;
    }



    if (link !== undefined) {
        advertisement.link = link || null;
    }


    if (placement !== undefined) {
        advertisement.placement = placement;
    }

    if (section !== undefined) {
        advertisement.section = section || null;
    }

    if (
        advertisement.placement === "HOME" &&
        !advertisement.section
    ) {

        const error = new Error(
            "Section is required for HOME advertisements"
        );

        error.statusCode = 400;

        throw error;
    }

    if (advertisement.placement !== "HOME") {
        advertisement.section = null;
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


        if (newImage) {

            await deleteImage(
                newImage.publicId
            );

        }

        throw error;
    }


    if (newImage && oldPublicId) {

        await deleteImage(
            oldPublicId
        );

    }


    return advertisement;
};


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


const getActiveAdvertisements = async (
    placement,
    section = null
) => {

    const now = new Date();

    const filter = {

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

    };

    if (section) {
        filter.section = section;
    }

    const advertisements =
        await Advertisement.find(filter)
            .sort({
                priority: -1,
                createdAt: -1
            })
            .lean();

    return advertisements;
};



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