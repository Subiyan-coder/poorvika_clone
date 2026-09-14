import { useEffect, useState } from "react";

import {
    useForm
} from "react-hook-form";

import FormInput from "../FormInput";
import ImageUploader from "../ImageUploader";

import {
    createAdvertisement,
    updateAdvertisement
} from "../../services/advertisementService";



// =========================
// Advertisement Form
// =========================

const AdvertisementForm = ({
    advertisement = null,
    onSuccess,
    onCancel
}) => {

    const isEditing = !!advertisement;


    const [image, setImage] = useState(null);

    const [existingImage, setExistingImage] = useState([]);

    const [serverError, setServerError] = useState("");

    const [loading, setLoading] = useState(false);


    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors
        }
    } = useForm({
        defaultValues: {
            title: "",
            link: "",
            placement: "LOGIN",
            status: "INACTIVE",
            startDate: "",
            endDate: "",
            priority: 0
        }
    });


    // =========================
    // Load Edit Data
    // =========================

    useEffect(() => {

        if (!advertisement) {

            reset({
                title: "",
                link: "",
                placement: "LOGIN",
                status: "INACTIVE",
                startDate: "",
                endDate: "",
                priority: 0
            });

            setImage(null);
            setExistingImage([]);

            return;
        }


        reset({
            title:
                advertisement.title || "",

            link:
                advertisement.link || "",

            placement:
                advertisement.placement || "LOGIN",

            status:
                advertisement.status || "INACTIVE",

            startDate:
                advertisement.startDate
                    ? advertisement.startDate.slice(0, 10)
                    : "",

            endDate:
                advertisement.endDate
                    ? advertisement.endDate.slice(0, 10)
                    : "",

            priority:
                advertisement.priority ?? 0
        });


        if (advertisement.image?.url) {

            setExistingImage([
                {
                    _id: advertisement._id,
                    url: advertisement.image.url,
                    publicId:
                        advertisement.image.publicId
                }
            ]);

        }

    }, [advertisement, reset]);


    // =========================
    // Submit
    // =========================

    const onSubmit = async (data) => {

        setServerError("");


        if (!isEditing && !image) {

            setServerError(
                "Advertisement image is required."
            );

            return;
        }


        if (
            data.startDate &&
            data.endDate &&
            new Date(data.startDate) >
            new Date(data.endDate)
        ) {

            setServerError(
                "End date cannot be before start date."
            );

            return;
        }


        try {

            setLoading(true);


            const advertisementData = {

                title:
                    data.title.trim(),

                image,

                link:
                    data.link?.trim() || "",

                placement:
                    data.placement,

                status:
                    data.status,

                startDate:
                    data.startDate || null,

                endDate:
                    data.endDate || null,

                priority:
                    Number(data.priority) || 0

            };


            let result;


            if (isEditing) {

                result =
                    await updateAdvertisement(
                        advertisement._id,
                        advertisementData
                    );

            }
            else {

                result =
                    await createAdvertisement(
                        advertisementData
                    );

            }


            if (onSuccess) {
                onSuccess(result);
            }

        }
        catch (error) {

            setServerError(
                error.response?.data?.message ||
                `Unable to ${
                    isEditing
                        ? "update"
                        : "create"
                } advertisement.`
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =========================
    // Remove Existing Image
    // =========================

    const handleDeleteExisting = () => {

        setExistingImage([]);

    };


    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >

            {/* Title */}

            <FormInput
                id="title"
                name="title"
                label="Advertisement Title"
                placeholder="Enter advertisement title"
                register={register}
                error={errors.title}
                disabled={loading}
            />


            {/* Image */}

            <ImageUploader
                value={image}
                onChange={setImage}
                existingImages={existingImage}
                onDeleteExisting={
                    isEditing
                        ? handleDeleteExisting
                        : false
                }
                multiple={false}
                maxFiles={1}
                disabled={loading}
                label="Advertisement Image"
            />


            {/* Link */}

            <FormInput
                id="link"
                name="link"
                label="Link"
                type="url"
                placeholder="https://example.com/product"
                register={register}
                error={errors.link}
                disabled={loading}
            />


            {/* Placement + Status */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
            ">

                {/* Placement */}

                <div>

                    <label
                        htmlFor="placement"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-700
                        "
                    >
                        Placement
                    </label>

                    <select
                        id="placement"
                        {...register("placement")}
                        disabled={loading}
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
                            transition
                            focus:border-gray-900
                            focus:ring-2
                            focus:ring-gray-100
                            disabled:cursor-not-allowed
                            disabled:bg-gray-100
                        "
                    >

                        <option value="LOGIN">
                            Login
                        </option>

                        <option value="HOME">
                            Home
                        </option>

                        <option value="PRODUCT">
                            Product
                        </option>

                    </select>

                </div>


                {/* Status */}

                <div>

                    <label
                        htmlFor="status"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-700
                        "
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        {...register("status")}
                        disabled={loading}
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
                            transition
                            focus:border-gray-900
                            focus:ring-2
                            focus:ring-gray-100
                            disabled:cursor-not-allowed
                            disabled:bg-gray-100
                        "
                    >

                        <option value="INACTIVE">
                            Inactive
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                    </select>

                </div>

            </div>


            {/* Dates */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
            ">

                <div>

                    <label
                        htmlFor="startDate"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-700
                        "
                    >
                        Start Date
                    </label>

                    <input
                        id="startDate"
                        type="date"
                        {...register("startDate")}
                        disabled={loading}
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
                    />

                </div>


                <div>

                    <label
                        htmlFor="endDate"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-700
                        "
                    >
                        End Date
                    </label>

                    <input
                        id="endDate"
                        type="date"
                        {...register("endDate")}
                        disabled={loading}
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
                    />

                </div>

            </div>


            {/* Priority */}

            <FormInput
                id="priority"
                name="priority"
                label="Priority"
                type="number"
                placeholder="0"
                register={register}
                error={errors.priority}
                numeric
                disabled={loading}
            />


            {/* Server Error */}

            {serverError && (

                <p className="
                    rounded-xl
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                ">
                    {serverError}
                </p>

            )}


            {/* Actions */}

            <div className="
                flex
                justify-end
                gap-3
                border-t
                border-gray-100
                pt-5
            ">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="
                        rounded-xl
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-gray-600
                        transition
                        hover:bg-gray-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={loading}
                    className="
                        rounded-xl
                        bg-gray-900
                        px-5
                        py-2.5
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
                        ? isEditing
                            ? "Updating..."
                            : "Creating..."
                        : isEditing
                            ? "Update Advertisement"
                            : "Create Advertisement"
                    }
                </button>

            </div>

        </form>
    );
};


export default AdvertisementForm;