const {
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    getActiveAdvertisements,
    getAllAdvertisements
} = require("../services/advertisementService");



const create = async (req, res, next) => {

    try {

        const result =
            await createAdvertisement({

                title: req.body.title,
                imageFile: req.file,
                link: req.body.link,
                placement: req.body.placement,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                priority: req.body.priority,
                createdBy: req.user.userId

            });


        return res.status(201).json({

            success: true,

            message:
                "Advertisement created successfully",

            data: {
                advertisement: result
            }

        });

    }
    catch (err) {

        next(err);

    }
};


const update = async (req, res, next) => {

    try {

        const result =
            await updateAdvertisement(

                req.params.id,

                {
                    title: req.body.title,
                    imageFile: req.file,
                    link: req.body.link,
                    placement: req.body.placement,
                    status: req.body.status,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    priority: req.body.priority
                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Advertisement updated successfully",

            data: {
                advertisement: result
            }

        });

    }
    catch (err) {

        next(err);

    }
};

const remove = async (req, res, next) => {

    try {

        const result =
            await deleteAdvertisement(
                req.params.id
            );


        return res.status(200).json({

            success: true,

            message: result.message

        });

    }
    catch (err) {

        next(err);

    }
};


const getAll = async (req, res, next) => {

    try {

        const result =
            await getAllAdvertisements();

        
        return res.status(200).json({

            success: true,

            data: {
                advertisements: result
            }

        });

    }
    catch (err) {

        next(err);

    }
};


const getActive = async (req, res, next) => {

    try {

        const result =
            await getActiveAdvertisements(
                req.query.placement
            );


        return res.status(200).json({

            success: true,
            data: {
                advertisements: result
            }

        });

    }
    catch (err) {

        next(err);

    }
};


module.exports = {

    create,
    update,
    remove,
    getAll,
    getActive

};