import { useEffect, useState } from "react";

import {
    useForm
} from "react-hook-form";

import FormInput from "./FormInput";

import {
    createAddress,
    updateAddress
} from "../services/addressService";

import countries from "../utils/countries";

import {
    lookupIndianPincode
} from "../utils/pincode";


const AddressForm = ({
    address = null,
    onSuccess,
    onCancel,
    isAdmin = false
}) => {

    const isEditMode = !!address;


    const [loading, setLoading] =
        useState(false);

    const [pincodeLoading, setPincodeLoading] =
        useState(false);

    const [pincodeError, setPincodeError] =
        useState("");

    const [areaOptions, setAreaOptions] =
        useState([]);


    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {
            errors
        }
    } = useForm({

        defaultValues: {

            type: "HOME",

            name: "",

            phone: "",

            alternativePhone: "",

            houseNo: "",

            addressLine1: "",

            addressLine2: "",

            postalCode: "",

            area: "",

            city: "",

            state: "",

            country: "India",

            isDefault:
                isAdmin
                    ? true
                    : false

        }

    });


    const country =
        watch("country");

    const postalCode =
        watch("postalCode");


    /*
    =========================
    Load Existing Address
    =========================
    */

    useEffect(() => {

        if (!address) {
            return;
        }


        reset({

            type:
                isAdmin
                    ? "HOME"
                    : address.type || "HOME",

            name:
                address.name || "",

            phone:
                address.phone || "",

            alternativePhone:
                address.alternativePhone || "",

            houseNo:
                address.houseNo || "",

            addressLine1:
                address.addressLine1 || "",

            addressLine2:
                address.addressLine2 || "",

            postalCode:
                address.postalCode || "",

            area:
                address.area || "",

            city:
                address.city || "",

            state:
                address.state || "",

            country:
                address.country || "India",

            isDefault:
                isAdmin
                    ? true
                    : !!address.isDefault

        });


    }, [
        address,
        reset,
        isAdmin
    ]);


    /*
    =========================
    Indian Pincode Lookup
    =========================
    */

    useEffect(() => {

        if (country !== "India") {

            setPincodeError("");
            setAreaOptions([]);

            return;
        }


        if (!postalCode) {

            setPincodeError("");
            setAreaOptions([]);

            return;
        }


        if (
            postalCode.length !== 6 ||
            !/^\d{6}$/.test(postalCode)
        ) {

            setPincodeError("");
            setAreaOptions([]);

            return;
        }


        const fetchPincode = async () => {

            try {

                setPincodeLoading(true);
                setPincodeError("");
                setAreaOptions([]);


                const result =
                    await lookupIndianPincode(
                        postalCode
                    );


                setAreaOptions(
                    result.areas
                );


                /*
                Automatically use the
                first area's location.
                Customer can change the
                area afterwards.
                */

                const firstArea =
                    result.areas[0];


                if (firstArea) {

                    setValue(
                        "state",
                        firstArea.state || ""
                    );


                    setValue(
                        "city",
                        firstArea.district || ""
                    );


                    setValue(
                        "country",
                        "India"
                    );

                }

            }
            catch (error) {

                console.error(
                    "Pincode lookup failed:",
                    error
                );


                setPincodeError(
                    error.message ||
                    "Unable to verify pincode. Please try again."
                );


                setValue(
                    "state",
                    ""
                );

                setValue(
                    "city",
                    ""
                );

            }
            finally {

                setPincodeLoading(false);

            }

        };


        fetchPincode();


    }, [
        postalCode,
        country,
        setValue
    ]);


    /*
    =========================
    Submit
    =========================
    */

    const onSubmit = async (data) => {

        try {

            setLoading(true);


            /*
            Admin rules are also
            enforced by backend.
            */

            if (isAdmin) {

                data.type = "HOME";

                data.isDefault = true;

            }


            let result;


            if (isEditMode) {

                result =
                    await updateAddress(
                        address._id,
                        data
                    );

            }
            else {

                result =
                    await createAddress(
                        data
                    );

            }


            if (onSuccess) {

                onSuccess(result);

            }

        }
        catch (error) {

            console.error(
                "Address save failed:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    =========================
    Country Change
    =========================
    */

    const handleCountryChange = (
        event
    ) => {

        const selectedCountry =
            event.target.value;


        setValue(
            "country",
            selectedCountry
        );


        /*
        Indian PIN lookup only
        applies to India.
        */

        setPincodeError("");
        setAreaOptions([]);


        if (
            selectedCountry !== "India"
        ) {

            setValue("state", "");
            setValue("city", "");
            setValue("area", "");

        }

    };


    /*
    =========================
    Area Change
    =========================
    */

    const handleAreaChange = (
        event
    ) => {

        const selectedArea =
            event.target.value;


        setValue(
            "area",
            selectedArea
        );


        const selectedPostOffice =
            areaOptions.find(
                (postOffice) =>
                    postOffice.name ===
                    selectedArea
            );


        if (!selectedPostOffice) {
            return;
        }


        setValue(
            "state",
            selectedPostOffice.state || ""
        );


        setValue(
            "city",
            selectedPostOffice.district || ""
        );

    };


    return (

        <form
            onSubmit={
                handleSubmit(onSubmit)
            }
            className="space-y-5"
        >

            {/* =========================
                Address Type
            ========================= */}

            {!isAdmin && (

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    ">
                        Address Type
                    </label>


                    <select
                        {...register("type")}
                        className="
                            h-12
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            px-4
                            text-sm
                            text-gray-900
                            outline-none
                            focus:border-gray-900
                            focus:ring-2
                            focus:ring-gray-100
                        "
                    >

                        <option value="HOME">
                            Home
                        </option>

                        <option value="OFFICE">
                            Office
                        </option>

                        <option value="OTHER">
                            Other
                        </option>

                    </select>

                </div>

            )}


            {/* Name */}

            <FormInput
                id="name"
                name="name"
                label="Full Name"
                placeholder="Enter full name"
                register={register}
                error={errors.name}
            />


            {/* Phone */}

            <FormInput
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                register={register}
                error={errors.phone}
            />


            {/* Alternative Phone */}

            <FormInput
                id="alternativePhone"
                name="alternativePhone"
                label="Alternative Phone"
                type="tel"
                placeholder="Enter alternative phone number"
                register={register}
                error={errors.alternativePhone}
            />


            {/* House Number */}

            <FormInput
                id="houseNo"
                name="houseNo"
                label="House / Flat Number"
                placeholder="Enter house or flat number"
                register={register}
                error={errors.houseNo}
            />


            {/* Address Line 1 */}

            <FormInput
                id="addressLine1"
                name="addressLine1"
                label="Address"
                placeholder="Street, building, etc."
                register={register}
                error={errors.addressLine1}
            />


            {/* Address Line 2 */}

            <FormInput
                id="addressLine2"
                name="addressLine2"
                label="Address Line 2"
                placeholder="Landmark, apartment, etc."
                register={register}
                error={errors.addressLine2}
            />


            {/* =========================
                Country
            ========================= */}

            <div>

                <label className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                ">
                    Country
                </label>


                <select
                    value={country}
                    onChange={
                        handleCountryChange
                    }
                    className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        px-4
                        text-sm
                        text-gray-900
                        outline-none
                        focus:border-gray-900
                        focus:ring-2
                        focus:ring-gray-100
                    "
                >

                    {countries.map(
                        (item) => (

                            <option
                                key={item.code}
                                value={item.name}
                            >
                                {item.name}
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* =========================
                Postal Code
            ========================= */}

            <div>

                <FormInput
                    id="postalCode"
                    name="postalCode"
                    label={
                        country === "India"
                            ? "Pincode"
                            : "Postal Code"
                    }
                    placeholder={
                        country === "India"
                            ? "Enter 6-digit pincode"
                            : "Enter postal code"
                    }
                    register={register}
                    error={errors.postalCode}
                    numeric={
                        country === "India"
                    }
                />


                {pincodeLoading && (

                    <p className="
                        mt-1.5
                        text-xs
                        text-gray-500
                    ">
                        Checking pincode...
                    </p>

                )}


                {pincodeError && (

                    <p className="
                        mt-1.5
                        text-xs
                        text-red-500
                    ">
                        {pincodeError}
                    </p>

                )}

            </div>


            {/* =========================
                State
            ========================= */}

            <FormInput
                id="state"
                name="state"
                label="State"
                placeholder="Enter state"
                register={register}
                error={errors.state}
                disabled={
                    country === "India" &&
                    !areaOptions.length
                }
            />


            {/* =========================
                City
            ========================= */}

            <FormInput
                id="city"
                name="city"
                label="City"
                placeholder="Enter city"
                register={register}
                error={errors.city}
                disabled={
                    country === "India" &&
                    !areaOptions.length
                }
            />


            {/* =========================
                Area
            ========================= */}

            {country === "India" ? (

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    ">
                        Area
                    </label>


                    <select
                        value={watch("area")}
                        onChange={
                            handleAreaChange
                        }
                        disabled={
                            !areaOptions.length
                        }
                        className="
                            h-12
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            px-4
                            text-sm
                            text-gray-900
                            outline-none
                            disabled:cursor-not-allowed
                            disabled:bg-gray-100
                            focus:border-gray-900
                            focus:ring-2
                            focus:ring-gray-100
                        "
                    >

                        <option value="">
                            Select Area
                        </option>


                        {areaOptions.map(
                            (postOffice, index) => (

                                <option
                                    key={`${postOffice.name}-${index}`}
                                    value={postOffice.name}
                                >
                                    {postOffice.name}
                                </option>

                            )
                        )}

                    </select>


                    {errors.area && (

                        <p className="
                            mt-1.5
                            text-xs
                            text-red-500
                        ">
                            {errors.area.message}
                        </p>

                    )}

                </div>

            ) : (

                <FormInput
                    id="area"
                    name="area"
                    label="Area"
                    placeholder="Enter area"
                    register={register}
                    error={errors.area}
                />

            )}


            {/* =========================
                Default Address
            ========================= */}

            {!isAdmin && (

                <label className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    text-sm
                    text-gray-700
                ">

                    <input
                        type="checkbox"
                        {...register("isDefault")}
                        className="
                            h-4
                            w-4
                            rounded
                            border-gray-300
                        "
                    />

                    <span>
                        Make this my default address
                    </span>

                </label>

            )}


            {/* =========================
                Actions
            ========================= */}

            <div className="
                flex
                gap-3
                pt-2
            ">

                {onCancel && (

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            h-12
                            flex-1
                            rounded-xl
                            border
                            border-gray-300
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:bg-gray-50
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>

                )}


                <button
                    type="submit"
                    disabled={
                        loading ||
                        pincodeLoading
                    }
                    className="
                        h-12
                        flex-1
                        rounded-xl
                        bg-gray-900
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-gray-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {loading
                        ? "Saving..."
                        : isEditMode
                            ? "Update Address"
                            : "Add Address"
                    }

                </button>

            </div>

        </form>

    );

};


export default AddressForm;