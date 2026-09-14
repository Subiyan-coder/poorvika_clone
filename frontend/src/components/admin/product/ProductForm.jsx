import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import FormInput from "../../FormInput";
import ImageUploader from "../../ImageUploader";
import ProductSpecification from "./ProductSpecification";


const ProductForm = ({
    initialData = null,
    categories = [],
    onSubmit,
    loading = false,
    onCancel,
    onDeleteImage
}) => {

    const [specification, setSpecification] = useState({});
    const [images, setImages] = useState([]);
    const [specificationError, setSpecificationError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors
        }
    } = useForm({
        defaultValues: {
            categoryId: "",
            name: "",
            brand: "",
            description: "",
            primarySpecificationName: "",
            primarySpecificationValue: "",

            secondarySpecificationName: "",
            secondarySpecificationValue: ""
        }
    });

    useEffect(() => {

        if (initialData) {

            reset({
                categoryId:
                    initialData.categoryId?._id ||
                    initialData.categoryId ||
                    "",

                name:
                    initialData.name || "",

                brand:
                    initialData.brand || "",

                description:
                    initialData.description || "",
                
                primarySpecificationName:
                    initialData.primarySpecification?.name || "",

                primarySpecificationValue:
                    initialData.primarySpecification?.value || "",

                secondarySpecificationName:
                    initialData.secondarySpecification?.name || "",

                secondarySpecificationValue:
                    initialData.secondarySpecification?.value || ""
            });
            
            setSpecification(
                initialData.specification &&
                typeof initialData.specification === "object"
                    ? initialData.specification
                    : {}
            );

            setImages([]);

        } else {

            reset({
                categoryId: "",
                name: "",
                brand: "",
                description: "",

                primarySpecificationName: "",
                primarySpecificationValue: "",

                secondarySpecificationName: "",
                secondarySpecificationValue: ""
            });

            setSpecification({});
            setImages([]);

        }

        setSpecificationError("");

    }, [initialData, reset]);


    const submitForm = (data) => {

        const specificationEntries =
            Object.entries(specification)
                .filter(
                    ([name, value]) =>
                        name.trim() &&
                        String(value).trim()
                );

        setSpecificationError("");


        const cleanSpecification = {};

        specificationEntries.forEach(
            ([name, value]) => {

                cleanSpecification[name.trim()] =
                    String(value).trim();

            }
        );


        onSubmit({

            productData: {
                categoryId: data.categoryId,
                name: data.name.trim(),
                brand: data.brand.trim(),
                description: data.description.trim(),

                primarySpecification: {
                    name: data.primarySpecificationName.trim(),
                    value: data.primarySpecificationValue.trim()
                },

                secondarySpecification: {
                    name: data.secondarySpecificationName?.trim() || "",
                    value: data.secondarySpecificationValue?.trim() || ""
                },
                
                specification: cleanSpecification
            },

            images

        });

    };


    return (
        <form
            onSubmit={handleSubmit(submitForm)}
            className="space-y-6"
        >

            {/* Category */}

            <div className="w-full">

                <label
                    htmlFor="categoryId"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    "
                >
                    Category
                </label>

                <select
                    id="categoryId"
                    {...register("categoryId", {
                        required: "Category is required"
                    })}
                    disabled={loading}
                    className={`
                        h-12
                        w-full
                        rounded-xl
                        border
                        bg-white
                        px-4
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        disabled:cursor-not-allowed
                        disabled:bg-gray-100
                        focus:border-gray-900
                        focus:ring-2
                        focus:ring-gray-100
                        ${
                            errors.categoryId
                                ? "border-red-500"
                                : "border-gray-300"
                        }
                    `}
                >

                    <option value="">
                        Select category
                    </option>

                    {categories.map((category) => (

                        <option
                            key={category._id}
                            value={category._id}
                        >
                            {category.name}
                        </option>

                    ))}

                </select>

                {errors.categoryId && (

                    <p className="
                        mt-1.5
                        text-xs
                        text-red-500
                    ">
                        {errors.categoryId.message}
                    </p>

                )}

            </div>


             {/* Image Uploader */}

            <ImageUploader
                value={images}
                onChange={setImages}
                existingImages={initialData?.images || []}
                onDeleteExisting={onDeleteImage}
                multiple
                maxFiles={10}
                label="Product Images"
                disabled={loading}
            />


            {/* Name */}

            <FormInput
                id="name"
                name="name"
                label="Product Name"
                placeholder="Enter product name"
                register={register}
                error={errors.name}
                disabled={loading}
            />


            {/* Brand */}

            <FormInput
                id="brand"
                name="brand"
                label="Brand"
                placeholder="Enter brand name"
                register={register}
                error={errors.brand}
                disabled={loading}
            />


            {/* Description */}

            <div className="w-full">

                <label
                    htmlFor="description"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    "
                >
                    Description
                </label>

                <textarea
                    id="description"
                    {...register("description", {
                        required: "Description is required"
                    })}
                    disabled={loading}
                    rows={5}
                    placeholder="Describe the product..."
                    className={`
                        w-full
                        resize-none
                        rounded-xl
                        border
                        bg-white
                        px-4
                        py-3
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        placeholder:text-gray-400
                        disabled:cursor-not-allowed
                        disabled:bg-gray-100
                        focus:border-gray-900
                        focus:ring-2
                        focus:ring-gray-100
                        ${
                            errors.description
                                ? "border-red-500"
                                : "border-gray-300"
                        }
                    `}
                />

                {errors.description && (

                    <p className="
                        mt-1.5
                        text-xs
                        text-red-500
                    ">
                        {errors.description.message}
                    </p>

                )}

            </div>


            {/* Primary Specification */}

            <div className="space-y-3">

                <p className="text-sm font-medium text-gray-700">
                    Primary Specification
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                    <FormInput
                        id="primarySpecificationName"
                        name="primarySpecificationName"
                        label="Name"
                        placeholder="e.g. Battery"
                        register={register}
                        error={errors.primarySpecificationName}
                        disabled={loading}
                    />

                    <FormInput
                        id="primarySpecificationValue"
                        name="primarySpecificationValue"
                        label="Value"
                        placeholder="e.g. 4000mAh"
                        register={register}
                        error={errors.primarySpecificationValue}
                        disabled={loading}
                    />

                </div>

            </div>


            {/* Secondary Specification */}

            <div className="space-y-3">

                <p className="text-sm font-medium text-gray-700">
                    Secondary Specification
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                    <FormInput
                        id="secondarySpecificationName"
                        name="secondarySpecificationName"
                        label="Name"
                        placeholder="e.g. Display"
                        register={register}
                        error={errors.secondarySpecificationName}
                        disabled={loading}
                    />

                    <FormInput
                        id="secondarySpecificationValue"
                        name="secondarySpecificationValue"
                        label="Value"
                        placeholder="e.g. 6.2 inch"
                        register={register}
                        error={errors.secondarySpecificationValue}
                        disabled={loading}
                    />

                </div>

            </div>


            {/* Specification */}

            <ProductSpecification
                value={
                    initialData?.specification || specification
                }
                onChange={setSpecification}
                disabled={loading}
                error={specificationError}
                resetKey={initialData?._id || "new"}
            />


            {/* Actions */}

            <div className="
                flex
                items-center
                justify-end
                gap-3
                border-t
                border-gray-200
                pt-5
            ">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="
                        rounded-xl
                        border
                        border-gray-300
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-gray-50
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
                        ? "Saving..."
                        : initialData
                            ? "Update Product"
                            : "Create Product"
                    }
                </button>

            </div>

        </form>
    );
};


export default ProductForm;