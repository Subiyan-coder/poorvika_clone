const {
    createAddress,
    getAllAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require("../services/addressService");

const { logger } = require("../utils/logger");


const create = async (req, res, next) => {

    try {

        const address = await createAddress(
            req.user.userId,
            req.user.role,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            data: address
        });

    }
    catch (err) {

        logger.error(`Address creation failed: ${err.message}`);

        next(err);
    }
};


const getAll = async (req, res, next) => {

    try {

        const addresses = await getAllAddress(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            data: addresses
        });

    }
    catch (err) {

        next(err);
    }
};


const getOne = async (req, res, next) => {

    try {

        const address = await getAddress(
            req.user.userId,
            req.params.addressId
        );

        return res.status(200).json({
            success: true,
            data: address
        });

    }
    catch (err) {

        next(err);
    }
};


const update = async (req, res, next) => {

    try {

        const address = await updateAddress(
            req.user.userId,
            req.user.role,
            req.params.addressId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: address
        });

    }
    catch (err) {

        next(err);
    }
};


const remove = async (req, res, next) => {

    try {

        const result = await deleteAddress(
            req.user.userId,
            req.user.role,
            req.params.addressId
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


const setDefault = async (req, res, next) => {

    try {

        const address = await setDefaultAddress(
            req.user.userId,
            req.user.role,
            req.params.addressId
        );

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            data: address
        });

    }
    catch (err) {

        next(err);
    }
};


module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove,
    setDefault
};