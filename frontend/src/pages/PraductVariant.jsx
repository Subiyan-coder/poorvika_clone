import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    addCustomerCartItem,
    getCustomerCart
} from "../services/customer/cartService";

import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Share2,
    GitCompare,
    ShoppingCart,
    Zap,
    Truck
} from "lucide-react";

import { toastSuccess } from "../utils/toast";

import {
    getCustomerProductVariant
} from "../services/customer/productVariantService";

import {
    getCustomerProduct
} from "../services/customer/productService";


const ProductVariant = () => {

    const { variantId } = useParams();
    const navigate = useNavigate();

    const [variant, setVariant] = useState(null);
    const [product, setProduct] = useState(null);

    const [isInCart, setIsInCart] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    
    const [selectedImage, setSelectedImage] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadProduct = async () => {

            try {

                setLoading(true);
                setError("");

                const variantResponse =
                    await getCustomerProductVariant(
                        variantId
                    );

                const selectedVariant =
                    variantResponse.data;

                setVariant(selectedVariant);

                const productResponse =
                    await getCustomerProduct(
                        selectedVariant.productId._id
                    );

                setProduct(
                    productResponse.data
                );

            }
            catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Unable to load product"
                );

            }
            finally {

                setLoading(false);

            }

        };


        if (variantId) {
            loadProduct();
        }

    }, [variantId]);
    

    useEffect(() => {

        setSelectedImage(0);

    }, [variant?._id]);


    useEffect(() => {

        const checkCart = async () => {

            if (!variant?._id) {
                setIsInCart(false);
                return;
            }

            try {

                const response = await getCustomerCart();

                const cart = response.data;

                const exists = cart?.items?.some(
                    item =>
                        item.productVariant?._id ===
                        variant._id
                );

                setIsInCart(Boolean(exists));

            }
            catch (err) {

                console.error(
                    "Failed to check cart:",
                    err
                );

                setIsInCart(false);

            }

        };

        checkCart();

    }, [variant?._id]);


    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-500">
                    Loading product...
                </p>
            </div>
        );

    }


    if (error || !variant || !product) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-red-500">
                    {error || "Product not found"}
                </p>
            </div>
        );

    }


    const images = [
        ...(product.images || []),
        ...(variant.images || [])
    ];


    const originalPrice =
        Number(variant.price || 0);

    const discountPrice =
        Number(variant.discountPrice || 0);

    const discountPercentage =
        Number(
            variant.discountPercentage || 0
        );


    const displayPrice =
        discountPercentage > 0 &&
        discountPrice > 0
            ? discountPrice
            : originalPrice;


    const hasDiscount =
        discountPercentage > 0 &&
        discountPrice > 0;


    const isAvailable =
        variant.inventory?.isAvailable === true &&
        Number(
            variant.inventory?.quantity || 0
        ) > 0;

    const variants =
        product.variants || [];


    const primaryName =
        variant.primarySpecification?.name;


    const secondaryName =
        variant.secondarySpecification?.name;

    const colors = [
        ...new Set(
            product.variants.map(
                variant => variant.color
            )
        )
    ];

    const primarySpecifications = [
        ...new Set(
            product.variants
                .map(
                    variant =>
                        variant.primarySpecification?.value
                )
                .filter(Boolean)
        )
    ];

    const secondarySpecifications = [
        ...new Set(
            product.variants
                .map(
                    variant =>
                        variant.secondarySpecification?.value
                )
                .filter(Boolean)
        )
    ];
    

    const selectVariant = (type, value) => {

        if (!variant || !variants.length) {
            return;
        }


        const matchingVariants =
            variants.filter(productVariant => {

                if (type === "color") {

                    return (
                        productVariant.color === value
                    );

                }


                if (type === "primary") {

                    return (
                        productVariant
                            .primarySpecification
                            ?.value === value
                    );

                }


                if (type === "secondary") {

                    return (
                        productVariant
                            .secondarySpecification
                            ?.value === value
                    );

                }


                return false;

            });


        if (!matchingVariants.length) {
            return;
        }

        const currentColor =
            variant.color;

        const currentPrimary =
            variant.primarySpecification?.value;

        const currentSecondary =
            variant.secondarySpecification?.value;


        const scoreVariant =
            productVariant => {

                let score = 0;


                if (
                    type !== "color" &&
                    productVariant.color ===
                        currentColor
                ) {

                    score++;

                }


                if (
                    type !== "primary" &&
                    productVariant
                        .primarySpecification
                        ?.value ===
                        currentPrimary
                ) {

                    score++;

                }


                if (
                    type !== "secondary" &&
                    productVariant
                        .secondarySpecification
                        ?.value ===
                        currentSecondary
                ) {

                    score++;

                }


                return score;

            };


        const nextVariant =
            [...matchingVariants]
                .sort(
                    (a, b) =>
                        scoreVariant(b) -
                        scoreVariant(a)
                )[0];


        if (!nextVariant) {
            return;
        }


        setVariant(nextVariant);

        setSelectedImage(0);

    };


    const handleCartAction = async () => {

        if (!variant?._id) {
            return;
        }

        if (isInCart) {

            navigate("/cart");

            return;
        }

        try {

            await addCustomerCartItem({
                productVariantId: variant._id,
                quantity: 1
            });

            setIsInCart(true);

            toastSuccess(
                "Item added to cart successfully"
            );

        }
        catch (err) {

            console.error(
                "Failed to add item to cart:",
                err
            );

        }

    };


    const handlePreviousImage = () => {

        setSelectedImage(current =>
            current === 0
                ? images.length - 1
                : current - 1
        );

    };


    const handleNextImage = () => {

        setSelectedImage(current =>
            current === images.length - 1
                ? 0
                : current + 1
        );

    };


    const handleBuyNow = () => {

        if (!isAvailable) {
            return;
        }

        navigate(
            `/order?type=direct&variantId=${variant._id}&quantity=1`
        );
    };



    return (
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6">

            {/* =========================
                PRODUCT MAIN SECTION
            ========================= */}

            <section className="
                grid
                grid-cols-1
                gap-8
                lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px]
            ">


                {/* =========================
                    LEFT - IMAGES
                ========================= */}

                <div className="flex gap-4">

                    {/* Thumbnails */}

                    <div className="
                        flex
                        w-20
                        shrink-0
                        flex-col
                        gap-3
                    ">

                        {images.map((image, index) => (

                            <button
                                key={
                                    image.publicId ||
                                    index
                                }
                                type="button"
                                onClick={() =>
                                    setSelectedImage(index)
                                }
                                className={`
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    ${
                                        selectedImage === index
                                            ? "border-black"
                                            : "border-gray-200"
                                    }
                                `}
                            >

                                <img
                                    src={image.url}
                                    alt={`${product.name} ${index + 1}`}
                                    className="
                                        aspect-square
                                        w-full
                                        object-contain
                                    "
                                />

                            </button>

                        ))}

                    </div>


                    {/* Main Image */}

                    <div className="
                        relative
                        flex
                        min-h-[420px]
                        flex-1
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-lg
                        bg-white
                    ">

                        {images.length > 0 && (

                            <img
                                src={
                                    images[selectedImage]?.url
                                }
                                alt={product.name}
                                className="
                                    max-h-[520px]
                                    w-full
                                    object-contain
                                "
                            />

                        )}


                        {images.length > 1 && (

                            <>
                                <button
                                    type="button"
                                    onClick={
                                        handlePreviousImage
                                    }
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        flex
                                        h-9
                                        w-9
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        shadow
                                    "
                                >
                                    <ChevronLeft
                                        size={20}
                                    />
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleNextImage
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        flex
                                        h-9
                                        w-9
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        shadow
                                    "
                                >
                                    <ChevronRight
                                        size={20}
                                    />
                                </button>
                            </>

                        )}

                    </div>

                </div>


                {/* =========================
                    MIDDLE - PRODUCT DETAILS
                ========================= */}

                <div className="space-y-5">

                    {/* Brand */}

                    <p className="text-sm font-medium text-gray-500">
                        {product.brand}
                    </p>


                    {/* Product Name */}

                    <h1 className="
                        text-2xl
                        font-semibold
                        leading-8
                        text-gray-900
                    ">
                        {product.name}
                    </h1>


                    {/* Rating placeholder */}

                    <div className="
                        flex
                        items-center
                        gap-2
                        text-sm
                    ">

                        <span className="
                            rounded
                            bg-green-600
                            px-2
                            py-1
                            font-medium
                            text-white
                        ">
                            4.3 ★
                        </span>

                        <span className="text-gray-500">
                            Ratings & Reviews
                        </span>

                    </div>


                    <div className="border-t border-gray-200" />


                    {/* Price */}

                    <div className="space-y-1">

                        <div className="flex items-center gap-3">

                            <span className="
                                text-3xl
                                font-semibold
                                text-gray-900
                            ">
                                ₹{displayPrice.toLocaleString("en-IN")}
                            </span>


                            {hasDiscount && (

                                <>
                                    <span className="
                                        text-base
                                        text-gray-500
                                        line-through
                                    ">
                                        ₹{originalPrice.toLocaleString("en-IN")}
                                    </span>

                                    <span className="
                                        text-sm
                                        font-semibold
                                        text-green-600
                                    ">
                                        {discountPercentage}% off
                                    </span>
                                </>

                            )}

                        </div>


                        {hasDiscount && (

                            <p className="text-sm text-gray-500">
                                Inclusive of all taxes
                            </p>

                        )}

                    </div>


                    {/* Availability */}

                    <div>

                        {isAvailable ? (

                            <p className="
                                font-medium
                                text-green-600
                            ">
                                In stock
                            </p>

                        ) : (

                            <p className="
                                font-medium
                                text-red-600
                            ">
                                Currently unavailable
                            </p>

                        )}

                    </div>


                    {/* Offers */}

                    <div className="
                        rounded-lg
                        border
                        border-gray-200
                        p-4
                    ">

                        <h2 className="
                            mb-3
                            font-semibold
                        ">
                            Available offers
                        </h2>

                        <p className="
                            text-sm
                            text-gray-600
                        ">
                            No offers available currently.
                        </p>

                    </div>


                    {/* Color */}

                    <div>

                        <p className="
                            mb-2
                            text-sm
                            font-medium
                        ">
                            Color
                        </p>


                        <div className="
                            flex
                            flex-wrap
                            gap-2
                        ">

                            {colors.map(color => {

                                const selected = variant.color === color;    


                                return (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() =>
                                            selectVariant(
                                                "color",
                                                color
                                            )
                                        }
                                        className={`
                                            rounded-md
                                            border
                                            px-4
                                            py-2
                                            transition

                                            ${
                                                selected
                                                    ? "border-orange-500 text-orange-500"
                                                    : "border-black text-black"
                                            }
                                        `}
                                    >
                                        {color}
                                    </button>
                                );

                            })}

                        </div>

                    </div>


                    {/* Primary Specification */}

                    <div>

                        <p className="
                            mb-2
                            text-sm
                            font-medium
                        ">
                            {primaryName}
                        </p>


                        <div className="
                            flex
                            flex-wrap
                            gap-2
                        ">

                            {primarySpecifications.map(value => {

                                const selected =
                                        variant.primarySpecification?.value === value;


                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() =>
                                            selectVariant(
                                                "primary",
                                                value
                                            )
                                        }
                                        className={`
                                            rounded-md
                                            border
                                            px-4
                                            py-2
                                            transition

                                            ${
                                                selected
                                                    ? "border-orange-500 text-orange-500"
                                                    : "border-black text-black"
                                            }
                                        `}
                                    >
                                        {value}
                                    </button>
                                );

                            })}

                        </div>

                    </div>


                    {/* Secondary Specification */}

                        {secondarySpecifications.map(value => {

                            const selected =
                                    variant.secondarySpecification?.value === value;        


                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() =>
                                        selectVariant(
                                            "secondary",
                                            value
                                        )
                                    }
                                    className={`
                                        rounded-md
                                        border
                                        px-4
                                        py-2
                                        transition

                                        ${
                                            selected
                                                ? "border-orange-500 text-orange-500"
                                                : "border-black text-black"
                                        }
                                    `}
                                >
                                    {value}
                                </button>
                            );

                        })}


                    {/* Delivery */}

                    <div className="
                        border-t
                        border-gray-200
                        pt-4
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <Truck
                                size={20}
                            />

                            <div>

                                <p className="
                                    text-sm
                                    font-medium
                                ">
                                    Delivery options
                                </p>

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">
                                    Enter your location to check delivery.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Actions */}

                    <div className="
                        flex
                        flex-wrap
                        gap-3
                    ">

                        <button
                            type="button"
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                px-4
                                py-2
                            "
                        >
                            <Heart size={18} />
                            Wishlist
                        </button>


                        <button
                            type="button"
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                px-4
                                py-2
                            "
                        >
                            <GitCompare size={18} />
                            Compare
                        </button>


                        <button
                            type="button"
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                px-4
                                py-2
                            "
                        >
                            <Share2 size={18} />
                            Share
                        </button>

                    </div>

                </div>


                {/* =========================
                    RIGHT - PURCHASE
                ========================= */}

                <aside className="
                    h-fit
                    rounded-xl
                    border
                    border-gray-200
                    p-5
                ">

                    <div className="
                        mb-5
                        flex
                        items-center
                        gap-3
                    ">

                        <Zap
                            size={22}
                        />

                        <h2 className="
                            font-semibold
                        ">
                            Frequently bought together
                        </h2>

                    </div>


                    <div className="
                        mb-6
                        rounded-lg
                        bg-gray-50
                        p-4
                    ">

                        <p className="
                            text-sm
                            text-gray-500
                        ">
                            Frequently bought together products
                            will appear here.
                        </p>

                    </div>


                    <div className="space-y-3">

                        <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={handleBuyNow}
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-black
                                px-5
                                py-3
                                font-medium
                                text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Zap size={18} />
                            Buy Now
                        </button>


                        <button
                            type="button"   
                            onClick={handleCartAction}
                            disabled={!isAvailable || addingToCart}
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-black
                                px-5
                                py-3
                                font-medium
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <ShoppingCart size={18} />

                            {isInCart ? "Go to Cart" : "Add to Cart"}

                        </button>
                        
                    </div>

                </aside>

            </section>

        </main>
    );
};


export default ProductVariant;