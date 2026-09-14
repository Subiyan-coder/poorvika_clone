import { useEffect, useState } from "react";
import ImageUploader from "../ImageUploader";

const CategoryForm = ({
    category = null,
    onSubmit,
    onClose,
    loading = false
}) => {

    const isEdit = Boolean(category);

    const [name, setName] = useState(
        category?.name || ""
    );


    const [description, setDescription] = useState(
        category?.description || ""
    );

    const [image, setImage] = useState(null);


    const handleSubmit = (event) => {

        event.preventDefault();

        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append(
            "description",
            description.trim()
        );

        if (image) {
            formData.append("image", image);
        }

        onSubmit(formData);
    };


    return (
        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
        ">

            <div className="
                flex
                max-h-[90vh]
                w-full
                max-w-3xl
                flex-col
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-xl
            ">

                {/* Header */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-gray-200
                    px-6
                    py-5
                ">

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-gray-900
                        ">
                            {isEdit
                                ? "Edit Category"
                                : "Add Category"}
                        </h2>

                        <p className="
                            mt-1
                            text-xs
                            text-gray-500
                        ">
                            {isEdit
                                ? "Update category information"
                                : "Create a new product category"}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            text-xl
                            text-gray-400
                            hover:text-gray-900
                        "
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto px-6 py-6"
                >

                    {/* Image */}

                    <ImageUploader
                        value={image}
                        onChange={setImage}
                        existingImages={
                            category?.images
                                ? [category.images]
                                : []
                        }
                        multiple={false}
                        maxFiles={1}
                        disabled={loading}
                    />


                    {/* Name */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            Category Name
                        </label>

                        <input
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="e.g. Smartphones"
                            disabled={loading}
                            required
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-gray-300
                                px-4
                                text-sm
                                outline-none
                                focus:border-gray-900
                                focus:ring-2
                                focus:ring-gray-100
                            "
                        />

                    </div>


                    {/* Description */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Describe this category..."
                            rows={4}
                            disabled={loading}
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-gray-300
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-gray-900
                                focus:ring-2
                                focus:ring-gray-100
                            "
                        />

                    </div>


                    {/* Actions */}

                    <div className="
                        flex
                        shrink-0
                        justify-end
                        gap-3
                        border-t
                        border-gray-200
                        pt-5
                        px-6 
                        py-4
                    ">

                        <button
                            type="button"
                            onClick={onClose}
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
                                hover:bg-gray-50
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
                                hover:bg-gray-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Saving..."
                                : isEdit
                                    ? "Save Changes"
                                    : "Create Category"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default CategoryForm;