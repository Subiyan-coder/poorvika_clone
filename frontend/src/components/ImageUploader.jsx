import { useEffect, useState } from "react";


const ImageUploader = ({
    value = [],
    onChange,

    existingImages = [],
    onDeleteExisting = false,

    multiple = false,
    maxFiles = 1,

    maxSize = 5 * 1024 * 1024,

    disabled = false,

    label = "Image",

    error
}) => {

    const [previews, setPreviews] = useState([]);
    const [fileError, setFileError] = useState("");


    const files = Array.isArray(value)
        ? value
        : value
            ? [value]
            : [];


    useEffect(() => {

        const urls = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setPreviews(urls);

        return () => {
            urls.forEach(item => {
                URL.revokeObjectURL(item.url);
            });
        };

    }, [value]);


    const handleChange = (event) => {

        const selectedFiles =
            Array.from(event.target.files || []);

        if (!selectedFiles.length) {
            return;
        }


        setFileError("");


        const invalidType = selectedFiles.find(
            file => !file.type.startsWith("image/")
        );

        if (invalidType) {
            setFileError(
                "Only image files are allowed."
            );

            event.target.value = "";
            return;
        }


        const invalidSize = selectedFiles.find(
            file => file.size > maxSize
        );

        if (invalidSize) {
            setFileError(
                "Each image must be 5 MB or smaller."
            );

            event.target.value = "";
            return;
        }


        if (multiple) {

            const combined = [
                ...files,
                ...selectedFiles
            ];

            onChange(
                combined.slice(0, maxFiles)
            );

        } else {

            onChange(
                selectedFiles[0]
            );

        }


        event.target.value = "";
    };


    const removeNewFile = (index) => {

        if (multiple) {

            const updatedFiles = [...files];

            updatedFiles.splice(index, 1);

            onChange(updatedFiles);

        } else {

            onChange(null);

        }
    };


    return (
        <div className="w-full">

            <label className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
            ">
                {label}
            </label>


            {/* Existing Images */}

            {existingImages.length > 0 && (

                <div className="
                    mb-4
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                    md:grid-cols-4
                ">

                    {existingImages.map(image => (

                        <div
                            key={image._id || image.publicId}
                            className="
                                relative
                                overflow-hidden
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                            "
                        >

                            <img
                                src={image.url}
                                alt="image"
                                className="
                                    h-32
                                    w-full
                                    object-cover
                                "
                            />


                            {onDeleteExisting && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDeleteExisting(image)
                                    }
                                    disabled={disabled}
                                    className="
                                        absolute
                                        right-2
                                        top-2
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-black/70
                                        text-white
                                        transition
                                        hover:bg-red-600
                                    "
                                >
                                    ×
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            )}


            {/* Upload Area */}

            <label className={`
                flex
                min-h-32
                cursor-pointer
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                border-gray-300
                bg-gray-50
                px-6
                py-6
                text-center
                transition

                ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:border-gray-500 hover:bg-gray-100"
                }
            `}>

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple={multiple}
                    disabled={disabled}
                    onChange={handleChange}
                    className="hidden"
                />


                <div>

                    <p className="
                        text-sm
                        font-medium
                        text-gray-700
                    ">
                        Click to upload
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-gray-500
                    ">
                        JPG, PNG or WEBP · Max 5 MB
                    </p>

                    {multiple && (
                        <p className="
                            mt-1
                            text-xs
                            text-gray-500
                        ">
                            Up to {maxFiles} images
                        </p>
                    )}

                </div>

            </label>


            {/* New File Previews */}

            {previews.length > 0 && (

                <div className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                    md:grid-cols-4
                ">

                    {previews.map(
                        (preview, index) => (

                            <div
                                key={`${preview.file.name}-${index}`}
                                className="
                                    relative
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                "
                            >

                                <img
                                    src={preview.url}
                                    alt={preview.file.name}
                                    className="
                                        h-32
                                        w-full
                                        object-cover
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        removeNewFile(index)
                                    }
                                    disabled={disabled}
                                    className="
                                        absolute
                                        right-2
                                        top-2
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-black/70
                                        text-white
                                        transition
                                        hover:bg-red-600
                                    "
                                >
                                    ×
                                </button>

                            </div>

                        )
                    )}

                </div>

            )}


            {(fileError || error) && (

                <p className="
                    mt-2
                    text-xs
                    text-red-500
                ">
                    {fileError || error}
                </p>

            )}

        </div>
    );
};


export default ImageUploader;