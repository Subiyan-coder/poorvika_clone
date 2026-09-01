const Address = require("../models/address");

const createAddress = async (userId, data) => {

    const address = await Address.create({
        userId,
        type: data.type,
        name: data.name,
        phone: data.phone,
        alternativePhone: data.alternativePhone,
        houseNo: data.houseNo,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        postalCode: data.postalCode,
        area: data.area,
        city: data.city,
        state: data.state,
        country: data.country,
        isDefault: data.isDefault
    });

    return address
};

const getAllAddress = async (userId) => {

    return Address.find(
        {userId}
    ).sort(
        {
            isDefault : -1,
            createdAt : -1
        }
    );
};

const getAddress = async (userId, addressId) => {

    const address = await Address.findOne(
        {
            _id : addressId,
            userId
        }
    );

    if(!address){
        const error = new Error("address not found");
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

const updateAddress = async (userId, addressId, data) => {

    const address = await Address.findOne(
        {
            _id : addressId,
            userId
        }
    );

    if(!address){
        const error = new Error("address not found");
        error.statusCode = 404;
        throw error;
    }

    const updates = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
            ALLOWED_FIELDS.includes(key)
        )
    );

    Object.assign(address, updates);

    await address.save();

    return address;
};

const deleteAddress = async (userId, addressId) => {

    const address = await Address.findOne(
        {
            _id : addressId,
            userId
        }
    );

    if (!address) {
        const error = new Error("Address not found");
        error.statusCode = 404;
        throw error;
    } 

    await address.deleteOne();

    return {
        message : "Address deleted successfully"
    }
};

const setDefaultAddress = async (userId, addressId) => {

    const address = await Address.findOne(
        {
            _id : addressId,
            userId
        }
    );

    if (!address) {
        const error = new Error("Address not found");
        error.statusCode = 404;
        throw error;
    }

    await Address.updateMany(
        {
            userId,
            isDefault : true
        },

        {
            $set : {
                isDefault : false
            }
        }
    );

    if (data.isDefault !== undefined) {
        address.isDefault = data.isDefault;
    }
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
}
