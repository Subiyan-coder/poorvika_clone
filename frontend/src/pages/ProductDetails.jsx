import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import {
    getCustomerProduct
} from "../services/customer/productService";

const ProductDetails = () => {

    const { productId } = useParams();


    const [product, setProduct] = useState(null);

    const [selectedVariant, setSelectedVariant] =
        useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchProduct = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getCustomerProduct(
                        productId
                    );

                const productData =
                    response.data;

                setProduct(productData);


                /*
                 * Select the first active variant
                 * as the initial variant.
                 */
                if (
                    productData.variants &&
                    productData.variants.length > 0
                ) {

                    setSelectedVariant(
                        productData.variants[0]
                    );

                }

            }
            catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load product"
                );

            }
            finally {

                setLoading(false);

            }

        };


        fetchProduct();

    }, [productId]);


    if (loading) {

        return (
            <div className="flex min-h-[400px] items-center justify-center">
                Loading product...
            </div>
        );

    }


    if (error) {

        return (
            <div className="flex min-h-[400px] items-center justify-center text-red-600">
                {error}
            </div>
        );

    }


    if (!product) {
        return null;
    }


    return (
        <main className="w-full">

            <div className="mx-auto max-w-[1400px] px-4 py-6">

                <div className="
                    grid
                    grid-cols-1
                    gap-6
                    lg:grid-cols-[minmax(320px,1fr)_minmax(400px,1.2fr)_320px]
                ">

                    {/* LEFT */}

                    <ProductImageGallery
                        product={product}
                        selectedVariant={selectedVariant}
                    />


                    {/* MIDDLE */}

                    <div>

                        <h1 className="text-2xl font-semibold">
                            TEST PRODUCT DETAILS
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            {product.brand}
                        </p>

                    </div>


                    {/* RIGHT */}

                    <div className="
                        rounded-lg
                        border
                        border-gray-200
                        p-4
                    ">

                        <h2 className="text-lg font-semibold">
                            Frequently Bought Together
                        </h2>

                    </div>

                </div>

            </div>

        </main>
    );
};


const ProductImageGallery = ({
    product,
    selectedVariant
}) => {

    const images = [
        ...(product.images || []),
        ...(selectedVariant?.images || [])
    ];


    const [selectedImage, setSelectedImage] =
        useState(0);


    useEffect(() => {

        setSelectedImage(0);

    }, [selectedVariant?._id]);


    if (!images.length) {

        return (
            <div className="
                flex
                min-h-[500px]
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                text-gray-500
            ">
                No image available
            </div>
        );

    }


    const currentImage =
        images[selectedImage] || images[0];


    return (
        <div className="w-full">

            {/* Main image */}

            <div className="
                flex
                h-[500px]
                items-center
                justify-center
                overflow-hidden
                rounded-lg
                border
                border-gray-200
                bg-white
            ">

                <img
                    src={currentImage.url}
                    alt={product.name}
                    className="
                        h-full
                        w-full
                        object-contain
                    "
                />

            </div>


            {/* Thumbnails */}

            <div className="
                mt-4
                flex
                gap-3
                overflow-x-auto
                pb-2
            ">

                {images.map(
                    (image, index) => (

                        <button
                            key={
                                image.publicId ||
                                `${image.url}-${index}`
                            }
                            type="button"
                            onClick={() =>
                                setSelectedImage(index)
                            }
                            className={`
                                flex
                                h-20
                                w-20
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-md
                                border
                                bg-white
                                ${
                                    index === selectedImage
                                        ? "border-orange-500"
                                        : "border-gray-200"
                                }
                            `}
                        >

                            <img
                                src={image.url}
                                alt={`${product.name} ${index + 1}`}
                                className="
                                    h-full
                                    w-full
                                    object-contain
                                "
                            />

                        </button>

                    )
                )}

            </div>

        </div>
    );
};

export default ProductDetails;