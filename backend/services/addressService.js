const Address = require("../models/address");



const createAddress = async (
    userId,
    role,
    data
) => {


    if (role === "ADMIN") {

        const existingAddress =
            await Address.findOne({
                userId
            });

        if (existingAddress) {

            const error = new Error(
                "Admin can have only one address"
            );

            error.statusCode = 400;

            throw error;
        }

        data.type = "HOME";
        data.isDefault = true;
    }


    if (role === "CUSTOMER") {

        const addressCount =
            await Address.countDocuments({
                userId
            });

        if (addressCount >= 3) {

            const error = new Error(
                "You can have a maximum of 3 addresses"
            );

            error.statusCode = 400;

            throw error;
        }
    }


    const address = await Address.create({

        userId,

        type:
            role === "ADMIN"
                ? "HOME"
                : data.type,

        name:
            data.name,

        phone:
            data.phone,

        alternativePhone:
            data.alternativePhone,

        houseNo:
            data.houseNo,

        addressLine1:
            data.addressLine1,

        addressLine2:
            data.addressLine2,

        postalCode:
            data.postalCode,

        area:
            data.area,

        city:
            data.city,

        state:
            data.state,

        country:
            data.country,

        isDefault:
            role === "ADMIN"
                ? true
                : data.isDefault

    });


    return address;
};


const getAllAddress = async (
    userId
) => {

    return Address.find(
        { userId }
    )
    .sort({
        isDefault: -1,
        createdAt: -1
    });
};



const getAddress = async (
    userId,
    addressId
) => {

    const address =
        await Address.findOne({
            _id: addressId,
            userId
        });


    if (!address) {

        const error =
            new Error(
                "Address not found"
            );

        error.statusCode = 404;

        throw error;
    }


    return address;
};



const ALLOWED_FIELDS = [

    "type",
    "name",
    "phone",
    "alternativePhone",
    "houseNo",
    "addressLine1",
    "addressLine2",
    "postalCode",
    "area",
    "city",
    "state",
    "country",
    "isDefault"

];


const updateAddress = async (
    userId,
    role,
    addressId,
    data
) => {

    const address =
        await Address.findOne({
            _id: addressId,
            userId
        });


    if (!address) {

        const error =
            new Error(
                "Address not found"
            );

        error.statusCode = 404;

        throw error;
    }


    if (role === "ADMIN") {


        if (
            data.type !== undefined &&
            data.type !== "HOME"
        ) {

            const error =
                new Error(
                    "Admin address must be a HOME address"
                );

            error.statusCode = 400;

            throw error;
        }


        if (
            data.isDefault !== undefined &&
            data.isDefault !== true
        ) {

            const error =
                new Error(
                    "Admin address must remain the default address"
                );

            error.statusCode = 400;

            throw error;
        }
    }


    const updates =
        Object.fromEntries(
            Object.entries(data)
                .filter(([key]) =>
                    ALLOWED_FIELDS.includes(key)
                )
        );


    if (role === "ADMIN") {

        updates.type = "HOME";
        updates.isDefault = true;
    }


    Object.assign(
        address,
        updates
    );


    await address.save();


    return address;
};



const deleteAddress = async (
    userId,
    role,
    addressId
) => {

    const address =
        await Address.findOne({
            _id: addressId,
            userId
        });


    if (!address) {

        const error =
            new Error(
                "Address not found"
            );

        error.statusCode = 404;

        throw error;
    }

    await address.deleteOne();


    return {
        message:
            "Address deleted successfully"
    };
};



const setDefaultAddress = async (
    userId,
    role,
    addressId
) => {

    const address =
        await Address.findOne({
            _id: addressId,
            userId
        });


    if (!address) {

        const error =
            new Error(
                "Address not found"
            );

        error.statusCode = 404;

        throw error;
    }

    if (role === "ADMIN") {

        address.type = "HOME";
        address.isDefault = true;

        await address.save();

        return address;
    }


    await Address.updateMany(

        {
            userId,
            isDefault: true
        },

        {
            $set: {
                isDefault: false
            }
        }

    );


    address.isDefault = true;

    await address.save();


    return address;
};


module.exports = {

    createAddress,
    getAddress,
    getAllAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress

};