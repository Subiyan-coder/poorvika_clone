import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import FormInput from "../../FormInput";
import KeyValueFields from "../common/KeyValueFields";
import ImageUploader from "../../ImageUploader";


const ProductVariantForm = ({
    initialData = null,
    products = [],
    loading = false,
    onSubmit,
    onCancel,
    onDeleteImage
}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({

        defaultValues: {
            productId: "",
            color: "",
            price: "",
            discountPercentage: "",

            primarySpecification: {
                name: "",
                value: ""
            },

            secondarySpecification: {
                name: "",
                value: ""
            }
        }

    });


    const [attributes, setAttributes] = useState({});
    const [images, setImages] = useState([]);
    const [attributesError, setAttributesError] =
        useState("");


    useEffect(() => {

        if (initialData) {

            reset({

                productId:
                    initialData.productId?._id ||
                    initialData.productId ||
                    "",

                color:
                    initialData.color || "",

                price:
                    initialData.price ?? "",

                discountPercentage:
                    initialData.discountPercentage ?? "",

                primarySpecification: {
                    name:
                        initialData.primarySpecification?.name || "",
                    value:
                        initialData.primarySpecification?.value || ""
                },

                secondarySpecification: {
                    name:
                        initialData.secondarySpecification?.name || "",
                    value:
                        initialData.secondarySpecification?.value || ""
                }

            });


            setAttributes(
                initialData.attributes &&
                typeof initialData.attributes === "object"
                    ? initialData.attributes
                    : {}
            );

            setImages([]);

        }
        else {

            reset({

                productId: "",
                color: "",
                price: "",
                discountPercentage: "",
                primarySpecification: {
                    name: "",
                    value: ""
                },

                secondarySpecification: {
                    name: "",
                    value: ""
                }

            });

            setAttributes({});
            setImages([]);

        }

        setAttributesError("");

    }, [initialData, reset]);


    const submitForm = (data) => {

        const attributeEntries =
            Object.entries(attributes)
                .filter(
                    ([name, value]) =>
                        name.trim() &&
                        String(value).trim()
                );


        setAttributesError("");


        const cleanAttributes = {};

        attributeEntries.forEach(
            ([name, value]) => {

                cleanAttributes[name.trim()] =
                    String(value).trim();

            }
        );

        onSubmit({

            variantData: {

                productId:
                    data.productId,

                color:
                    data.color.trim(),

                primarySpecification: {
                    name: data.primarySpecification.name.trim(),
                    value: data.primarySpecification.value.trim()
                },

                secondarySpecification: {
                    name: data.secondarySpecification.name.trim(),
                    value: data.secondarySpecification.value.trim()
                },

                price:
                    Number(data.price),

                discountPercentage:
                    Number(data.discountPercentage || 0),

                attributes:
                    cleanAttributes

            },

            images

        });

    };


    return (

        <form
            onSubmit={handleSubmit(submitForm)}
            className="space-y-5"
        >

            {/* Product */}

            <div>

                <label className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-gray-700
                ">
                    Product
                </label>


                <select
                    {...register("productId", {
                        required:
                            "Product is required"
                    })}
                    disabled={
                        loading ||
                        Boolean(initialData)
                    }
                    className="admin-select w-full"
                >

                    <option value="">
                        Select Product
                    </option>

                    {products.map(product => (

                        <option
                            key={product._id}
                            value={product._id}
                        >
                            {product.name}
                            {product.brand
                                ? ` - ${product.brand}`
                                : ""}
                        </option>

                    ))}

                </select>


                {errors.productId && (

                    <p className="
                        mt-1
                        text-xs
                        text-red-500
                    ">
                        {errors.productId.message}
                    </p>

                )}

            </div>


            {/* Color */}

            <FormInput
                id="color"
                name="color"
                label="Color"
                placeholder="e.g. Blue"
                register={register}
                error={errors.color}
                disabled={loading}
            />

            {/* Primary Specification */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <FormInput
                    id="primarySpecificationName"
                    name="primarySpecification.name"
                    label="Primary Specification"
                    placeholder="e.g. RAM"
                    register={register}
                    error={errors.primarySpecification?.name}
                    disabled={loading}
                />

                <FormInput
                    id="primarySpecificationValue"
                    name="primarySpecification.value"
                    label="Value"
                    placeholder="e.g. 8GB"
                    register={register}
                    error={errors.primarySpecification?.value}
                    disabled={loading}
                />

            </div>


            {/* Secondary Specification */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <FormInput
                    id="secondarySpecificationName"
                    name="secondarySpecification.name"
                    label="Secondary Specification"
                    placeholder="e.g. Storage"
                    register={register}
                    error={errors.secondarySpecification?.name}
                    disabled={loading}
                />

                <FormInput
                    id="secondarySpecificationValue"
                    name="secondarySpecification.value"
                    label="Value"
                    placeholder="e.g. 1TB"
                    register={register}
                    error={errors.secondarySpecification?.value}
                    disabled={loading}
                />

            </div>

            

            {/* Price */}

            <FormInput
                id="price"
                name="price"
                label="Price"
                type="number"
                placeholder="Enter price"
                register={register}
                error={errors.price}
                disabled={loading}
            />


            {/* Discount Percentage */}

            <FormInput
                id="discountPercentage"
                name="discountPercentage"
                label="Discount Percentage"
                type="number"
                placeholder="Enter discount Percentage"
                register={register}
                error={errors.discountPercentage}
                disabled={loading}
            /> 


            {/* Attributes */}

            <KeyValueFields
                value={attributes}
                onChange={setAttributes}
                disabled={loading}
                error={attributesError}
                resetKey={
                    initialData?._id || "new"
                }
                label="Attributes"
                keyPlaceholder="Attribute"
                valuePlaceholder="Value"
                addLabel="Add Attribute"
            />


            {/* Images */}

            <ImageUploader
                value={images}
                onChange={setImages}
                existingImages={
                    initialData?.images || []
                }
                onDeleteExisting={onDeleteImage}
                multiple
                maxFiles={10}
                label="Variant Images"
                disabled={loading}
            />


            {/* Actions */}

            <div className="
                flex
                justify-end
                gap-3
                pt-2
            ">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="admin-button-secondary"
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
                        hover:bg-gray-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Saving..."
                        : initialData
                            ? "Update Variant"
                            : "Create Variant"}
                </button>

            </div>

        </form>

    );

};


export default ProductVariantForm;