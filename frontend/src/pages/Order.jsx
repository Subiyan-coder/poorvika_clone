import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    MapPin,
    ChevronRight
} from "lucide-react";

import {
    toastError
} from "../utils/toast"

import {
    getAllAddresses
} from "../services/addressService";


import {
    getCustomerProductVariant
} from "../services/customer/productVariantService";

import {
    getCustomerCart
} from "../services/customer/cartService";



const Order = () => {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();


    /*
     * ====================
     * CHECKOUT TYPE
     * ====================
     */

    const type =
        searchParams.get("type");

    const variantId =
        searchParams.get("variantId");

    const quantityParam =
        Number(
            searchParams.get("quantity") || 1
        );


    /*
     * ====================
     * STATE
     * ====================
     */

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [addresses, setAddresses] =
        useState([]);

    const [selectedAddressId, setSelectedAddressId] =
        useState(null);

    const [directVariant, setDirectVariant] =
        useState(null);

    const [cartItems, setCartItems] =
        useState([]);


    /*
     * ====================
     * LOAD CHECKOUT DATA
     * ====================
     */

    useEffect(() => {

        const loadCheckout = async () => {

            try {

                setLoading(true);
                setError("");


                /*
                 * -------------------------------------------------
                 * Validate checkout type
                 * -------------------------------------------------
                 */

                if (
                    type !== "direct" &&
                    type !== "cart"
                ) {

                    throw new Error(
                        "Invalid checkout type"
                    );

                }


                /*
                 * -------------------------------------------------
                 * Load addresses
                 * -------------------------------------------------
                 */

                const addressResponse =
                    await getAllAddresses();

                const userAddresses =
                    addressResponse?.data || [];

                setAddresses(
                    userAddresses
                );


                /*
                 * -------------------------------------------------
                 * No address
                 * -------------------------------------------------
                 */

if (userAddresses.length === 0) {

    const currentPath =
        window.location.pathname;

    const existingReturnUrl =
        sessionStorage.getItem(
            "checkoutReturnUrl"
        );

    if (
        currentPath.startsWith("/order") &&
        !existingReturnUrl
    ) {

        const checkoutReturnUrl =
            window.location.pathname +
            window.location.search;

        sessionStorage.setItem(
            "checkoutReturnUrl",
            checkoutReturnUrl
        );
    }

    navigate(
        "/profile/address",
        {
            replace: true
        }
    );

    return;
}



                /*
                 * -------------------------------------------------
                 * Select default address
                 * -------------------------------------------------
                 */

                const defaultAddress =
                    userAddresses.find(
                        address =>
                            address.isDefault === true
                    );


                const initialAddress =
                    defaultAddress ||
                    userAddresses[0];


                setSelectedAddressId(
                    initialAddress._id
                );


                /*
                 * -------------------------------------------------
                 * DIRECT CHECKOUT
                 * -------------------------------------------------
                 */

                if (type === "direct") {

                    if (!variantId) {

                        throw new Error(
                            "Product variant is missing"
                        );

                    }


                    const variantResponse =
                        await getCustomerProductVariant(
                            variantId
                        );


                    const variant =
                        variantResponse?.data;


                    if (!variant) {

                        throw new Error(
                            "Product variant not found"
                        );

                    }


                    setDirectVariant(
                        variant
                    );

                }


                /*
                 * -------------------------------------------------
                 * CART CHECKOUT
                 * -------------------------------------------------
                 */

                if (type === "cart") {

                    const cartResponse =
                        await getCustomerCart();


                    const cart =
                        cartResponse?.data;


                    const selectedItems =
                        (
                            cart?.items || []
                        ).filter(
                            item =>
                                item.selected === true
                        );


                    if (
                        selectedItems.length === 0
                    ) {

                        throw new Error(
                            "No items selected for checkout"
                        );

                    }


                    setCartItems(
                        selectedItems
                    );

                }

            }
            catch (err) {

                console.error(
                    "Checkout loading failed:",
                    err
                );


                const message =
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load checkout";


                setError(message);

                toastError(message);

            }
            finally {

                setLoading(false);

            }

        };


        loadCheckout();

    }, [
        type,
        variantId,
        navigate
    ]);


    /*
     * ====================
     * ADDRESS HELPERS
     * ====================
     */

    const selectedAddress =
        addresses.find(
            address =>
                address._id ===
                selectedAddressId
        ) || null;


    const handleAddressChange = (
        addressId
    ) => {

        setSelectedAddressId(
            addressId
        );

    };


    /*
     * ====================
     * CHECKOUT ITEMS
     * ====================
     */

    const orderItems = useMemo(() => {

        if (type === "direct") {

            if (!directVariant) {
                return [];
            }


            return [
                {
                    productVariant:
                        directVariant,

                    quantity:
                        quantityParam
                }
            ];

        }


        return cartItems;

    }, [
        type,
        directVariant,
        quantityParam,
        cartItems
    ]);


    /*
     * ====================
     * PRODUCT HELPERS
     * ====================
     */

    const getProductName = (
        item
    ) => {

        const variant =
            item?.productVariant;

        return (
            variant?.productId?.name ||
            variant?.productId?.productName ||
            "Product"
        );

    };


    const getVariantImage = (
        item
    ) => {

        const images =
            item?.productVariant?.images ||
            [];


        return (
            images[0]?.url ||
            null
        );

    };


    const getSellingPrice = (
        item
    ) => {

        const variant =
            item?.productVariant;


        if (!variant) {
            return 0;
        }


        if (
            variant.discountPrice !== null &&
            variant.discountPrice !== undefined
        ) {

            return Number(
                variant.discountPrice
            );

        }


        return Number(
            variant.price || 0
        );

    };


    const getOriginalPrice = (
        item
    ) => {

        return Number(
            item?.productVariant?.price ||
            0
        );

    };


    const getAttributes = (
        item
    ) => {

        const attributes =
            item?.productVariant?.attributes;


        if (!attributes) {
            return [];
        }


        if (
            typeof attributes ===
            "object" &&
            !Array.isArray(attributes)
        ) {

            return Object.entries(
                attributes
            ).map(
                ([key, value]) =>
                    `${key}: ${value}`
            );

        }


        if (
            Array.isArray(attributes)
        ) {

            return attributes
                .map(attribute => {

                    if (
                        typeof attribute ===
                        "string"
                    ) {

                        return attribute;

                    }


                    if (
                        !attribute
                    ) {

                        return null;

                    }


                    const name =
                        attribute.name ||
                        attribute.key ||
                        attribute.attribute;


                    const value =
                        attribute.value;


                    if (
                        name &&
                        value
                    ) {

                        return `${name}: ${value}`;

                    }


                    return (
                        value ||
                        name ||
                        null
                    );

                })
                .filter(Boolean);

        }


        return [];

    };



    const subtotal = useMemo(() => {

        return orderItems.reduce(
            (
                total,
                item
            ) => {

                const price =
                    getSellingPrice(
                        item
                    );

                const quantity =
                    Number(
                        item.quantity || 1
                    );


                return (
                    total +
                    price * quantity
                );

            },
            0
        );

    }, [
        orderItems
    ]);


    const originalTotal =
        useMemo(() => {

            return orderItems.reduce(
                (
                    total,
                    item
                ) => {

                    const price =
                        getOriginalPrice(
                            item
                        );

                    const quantity =
                        Number(
                            item.quantity || 1
                        );


                    return (
                        total +
                        price * quantity
                    );

                },
                0
            );

        }, [
            orderItems
        ]);


    const discount =
        Math.max(
            originalTotal -
            subtotal,
            0
        );


    const deliveryCharge = 0;


    const totalAmount =
        subtotal +
        deliveryCharge;


    const formatPrice = (
        amount
    ) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(amount);

    };



    /*
     * ====================
     * LOADING
     * ====================
     */

    if (loading) {

        return (

            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
            ">

                <p className="
                    text-sm
                    text-gray-500
                ">
                    Loading checkout...
                </p>

            </div>

        );

    }


    /*
     * ====================
     * ERROR
     * ====================
     */

    if (
        error ||
        orderItems.length === 0
    ) {

        return (

            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
                px-4
            ">

                <div className="
                    text-center
                ">

                    <p className="
                        mb-4
                        text-sm
                        text-red-500
                    ">
                        {
                            error ||
                            "No items available for checkout"
                        }
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/cart")
                        }
                        className="
                            rounded-lg
                            bg-black
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                        "
                    >
                        Back to Cart
                    </button>

                </div>

            </div>

        );

    }

    const handleProceedToPay = () => {

        if (!selectedAddressId) {

            toastError(
                "Please select a delivery address"
            );

            return;
        }


        if (orderItems.length === 0) {

            toastError(
                "No items available for checkout"
            );

            return;
        }


        const checkoutItems =
            orderItems.map(
                item => ({
                    productVariantId:
                        item.productVariant._id,

                    quantity:
                        Number(
                            item.quantity || 1
                        )
                })
            );


        navigate(
            "/payment",
            {
                state: {

                    // =========================
                    // Backend checkout data
                    // =========================

                    type,

                    addressId:
                        selectedAddressId,

                    items:
                        checkoutItems,


                    // =========================
                    // Display data
                    // =========================

                    displayItems:
                        orderItems,

                    address:
                        selectedAddress,

                    subtotal,

                    discount,

                    deliveryCharge,

                    totalAmount

                }
            }
        );

    };


    /*
     * ====================
     * RENDER
     * ====================
     */

    return (

        <main className="
            min-h-screen
            bg-gray-50
            px-4
            py-6
        ">

            <div className="
                mx-auto
                w-full
                max-w-7xl
            ">


                {/* ========
                    BREADCRUMB
                ======== */}

                <div className="
                    mb-5
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-400
                ">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/cart")
                        }
                        className="
                            hover:text-black
                        "
                    >
                        Cart
                    </button>

                    <ChevronRight
                        size={15}
                    />

                    <span className="
                        text-gray-600
                    ">
                        Checkout
                    </span>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    lg:grid-cols-[minmax(0,1fr)_360px]
                ">


                    {/* ====
                        LEFT
                    ==== */}

                    <section className="
                        space-y-5
                    ">


                        {/* 
                            ADDRESS
                         */}

                        <div className="
                            overflow-hidden
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-gray-200
                                px-5
                                py-4
                            ">

                                <div>

                                    <h2 className="
                                        text-lg
                                        font-semibold
                                    ">
                                        Delivery Address
                                    </h2>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-gray-500
                                    ">
                                        Choose where you want
                                        your order delivered.
                                    </p>

                                </div>


                                <MapPin
                                    size={22}
                                />

                            </div>


                            <div className="
                                grid
                                gap-3
                                p-5
                                sm:grid-cols-2
                                lg:grid-cols-3
                            ">

                                {addresses.map(
                                    address => {

                                        const selected =
                                            address._id ===
                                            selectedAddressId;


                                        return (

                                            <button
                                                key={
                                                    address._id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleAddressChange(
                                                        address._id
                                                    )
                                                }
                                                className={`
                                                    relative
                                                    rounded-lg
                                                    border
                                                    p-4
                                                    text-left
                                                    transition
                                                    ${
                                                        selected
                                                            ? `
                                                                border-orange-500
                                                                bg-orange-50
                                                            `
                                                            : `
                                                                border-gray-200
                                                                hover:border-gray-400
                                                            `
                                                    }
                                                `}
                                            >

                                                <div className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                ">

                                                    <span className="
                                                        rounded-full
                                                        bg-gray-100
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                    ">
                                                        {
                                                            address.type ||
                                                            "HOME"
                                                        }
                                                    </span>


                                                    {selected && (

                                                        <span className="
                                                            text-xs
                                                            font-semibold
                                                            text-orange-600
                                                        ">
                                                            Selected
                                                        </span>

                                                    )}

                                                </div>


                                                <p className="
                                                    font-semibold
                                                ">
                                                    {
                                                        address.name
                                                    }
                                                </p>


                                                <p className="
                                                    mt-1
                                                    text-sm
                                                    text-gray-600
                                                ">
                                                    {
                                                        address.phone
                                                    }
                                                </p>


                                                <p className="
                                                    mt-2
                                                    text-sm
                                                    leading-5
                                                    text-gray-600
                                                ">

                                                    {address.houseNo &&
                                                        `${address.houseNo}, `}

                                                    {
                                                        address.addressLine1
                                                    }

                                                    {address.addressLine2 &&
                                                        `, ${address.addressLine2}`}

                                                    <br />

                                                    {
                                                        address.area
                                                    }

                                                    ,{" "}
                                                    {
                                                        address.city
                                                    }

                                                    <br />

                                                    {
                                                        address.state
                                                    }

                                                    {" - "}

                                                    {
                                                        address.postalCode
                                                    }

                                                </p>

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        </div>


                        {/* ORDER SUMMARY */}

                        <div className="
                            overflow-hidden
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                        ">

                            <div className="
                                border-b
                                border-gray-200
                                px-5
                                py-4
                            ">

                                <h2 className="
                                    text-lg
                                    font-semibold
                                ">
                                    Order Summary
                                </h2>

                            </div>


                            <div className="
                                space-y-4
                                p-5
                            ">

                                {orderItems.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const variant =
                                            item.productVariant;

                                        const image =
                                            getVariantImage(
                                                item
                                            );

                                        const sellingPrice =
                                            getSellingPrice(
                                                item
                                            );

                                        const originalPrice =
                                            getOriginalPrice(
                                                item
                                            );

                                        const quantity =
                                            Number(
                                                item.quantity ||
                                                1
                                            );

                                        const attributes =
                                            getAttributes(
                                                item
                                            );


                                        return (

                                            <div
                                                key={
                                                    variant?._id ||
                                                    index
                                                }
                                                className="
                                                    flex
                                                    gap-4
                                                    rounded-lg
                                                    border
                                                    border-gray-200
                                                    p-4
                                                "
                                            >

                                                {/* IMAGE */}

                                                <div className="
                                                    flex
                                                    h-28
                                                    w-28
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-gray-50
                                                    p-2
                                                ">

                                                    {image ? (

                                                        <img
                                                            src={
                                                                image
                                                            }
                                                            alt={
                                                                getProductName(
                                                                    item
                                                                )
                                                            }
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-contain
                                                            "
                                                        />

                                                    ) : (

                                                        <span className="
                                                            text-xs
                                                            text-gray-400
                                                        ">
                                                            No Image
                                                        </span>

                                                    )}

                                                </div>


                                                {/* DETAILS */}

                                                <div className="
                                                    min-w-0
                                                    flex-1
                                                ">

                                                    <h3 className="
                                                        font-medium
                                                    ">
                                                        {
                                                            getProductName(
                                                                item
                                                            )
                                                        }
                                                    </h3>


                                                    <p className="
                                                        mt-1
                                                        text-sm
                                                        text-gray-500
                                                    ">
                                                        SKU:{" "}
                                                        {
                                                            variant?.sku ||
                                                            "-"
                                                        }
                                                    </p>


                                                    {attributes.length > 0 && (

                                                        <div className="
                                                            mt-2
                                                            flex
                                                            flex-wrap
                                                            gap-2
                                                        ">

                                                            {attributes.map(
                                                                (
                                                                    attribute,
                                                                    attributeIndex
                                                                ) => (

                                                                    <span
                                                                        key={
                                                                            attributeIndex
                                                                        }
                                                                        className="
                                                                            rounded
                                                                            bg-gray-100
                                                                            px-2
                                                                            py-1
                                                                            text-xs
                                                                            text-gray-600
                                                                        "
                                                                    >
                                                                        {
                                                                            attribute
                                                                        }
                                                                    </span>

                                                                )
                                                            )}

                                                        </div>

                                                    )}


                                                    <div className="
                                                        mt-3
                                                        flex
                                                        flex-wrap
                                                        items-center
                                                        gap-3
                                                    ">

                                                        <span className="
                                                            text-lg
                                                            font-semibold
                                                            text-orange-600
                                                        ">
                                                            {
                                                                formatPrice(
                                                                    sellingPrice
                                                                )
                                                            }
                                                        </span>


                                                        {originalPrice >
                                                            sellingPrice && (

                                                            <span className="
                                                                text-sm
                                                                text-gray-400
                                                                line-through
                                                            ">
                                                                {
                                                                    formatPrice(
                                                                        originalPrice
                                                                    )
                                                                }
                                                            </span>

                                                        )}


                                                        <span className="
                                                            text-sm
                                                            text-gray-500
                                                        ">
                                                            ×{" "}
                                                            {
                                                                quantity
                                                            }
                                                        </span>

                                                    </div>


                                                    <p className="
                                                        mt-2
                                                        text-sm
                                                        font-medium
                                                    ">
                                                        Item Total:{" "}
                                                        {
                                                            formatPrice(
                                                                sellingPrice *
                                                                quantity
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    </section>


                    {/* RIGHT - PRICE SUMMARY */}

                    <aside className="
                        h-fit
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                    ">

                        <div className="
                            border-b
                            border-gray-200
                            px-5
                            py-4
                        ">

                            <h2 className="
                                text-lg
                                font-semibold
                            ">
                                Order Summary
                            </h2>

                        </div>


                        <div className="
                            space-y-5
                            p-5
                        ">

                            <div className="
                                flex
                                justify-between
                                text-sm
                            ">

                                <span className="
                                    text-gray-600
                                ">
                                    Items (
                                    {
                                        orderItems.length
                                    }
                                    )
                                </span>

                                <span>
                                    {
                                        formatPrice(
                                            originalTotal
                                        )
                                    }
                                </span>

                            </div>


                            <div className="
                                flex
                                justify-between
                                text-sm
                            ">

                                <span className="
                                    text-gray-600
                                ">
                                    Discount
                                </span>

                                <span className="
                                    text-green-600
                                ">
                                    -{" "}
                                    {
                                        formatPrice(
                                            discount
                                        )
                                    }
                                </span>

                            </div>


                            <div className="
                                flex
                                justify-between
                                text-sm
                            ">

                                <span className="
                                    text-gray-600
                                ">
                                    Delivery
                                </span>

                                <span className="
                                    text-green-600
                                ">
                                    {
                                        deliveryCharge === 0
                                            ? "Free"
                                            : formatPrice(
                                                deliveryCharge
                                            )
                                    }
                                </span>

                            </div>


                            <div className="
                                border-t
                                border-gray-200
                                pt-5
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <span className="
                                        text-base
                                        font-semibold
                                    ">
                                        Total Amount
                                    </span>


                                    <span className="
                                        text-xl
                                        font-bold
                                    ">
                                        {
                                            formatPrice(
                                                totalAmount
                                            )
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* SELECTED ADDRESS */}

                            {selectedAddress && (

                                <div className="
                                    rounded-lg
                                    bg-gray-50
                                    p-4
                                ">

                                    <p className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-gray-500
                                    ">
                                        Delivering To
                                    </p>


                                    <p className="
                                        mt-1
                                        font-medium
                                    ">
                                        {
                                            selectedAddress.name
                                        }
                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        text-gray-600
                                    ">
                                        {
                                            selectedAddress.city
                                        }
                                        ,{" "}
                                        {
                                            selectedAddress.state
                                        }
                                        {" - "}
                                        {
                                            selectedAddress.postalCode
                                        }
                                    </p>

                                </div>

                            )}


                            {/* PAYMENT BUTTON COMES LATER */}

                            <button
                                type="button"
                                onClick={handleProceedToPay}
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-lg
                                    bg-orange-500
                                    px-5
                                    py-3
                                    font-semibold
                                    text-white
                                    hover:bg-orange-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {loading ? "Processing..." : "Proceed to Pay"}
                            </button>


                            <p className="
                                text-center
                                text-xs
                                text-gray-400
                            ">
                                Payment options will appear
                                in the next checkout step.
                            </p>

                        </div>

                    </aside>

                </div>

            </div>

        </main>

    );

};


export default Order;