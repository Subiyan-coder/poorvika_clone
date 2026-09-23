import {
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    toastSuccess,
    toastError
} from "../utils/toast";

import {
    createCustomerDirectOrder,
    createCustomerCartOrder
} from "../services/customer/orderService";

import {
    createCustomerPayment
} from "../services/customer/paymentService";


const Payment = () => {

    const location =
        useLocation();

    const navigate =
        useNavigate();


    const checkout =
        location.state;


    const [selectedMethod, setSelectedMethod] =
        useState(null);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // =========================
    // CHECKOUT PROTECTION
    // =========================

    if (
        !checkout ||
        !checkout.addressId ||
        !checkout.items?.length
    ) {

        return (
            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    px-4
                "
            >

                <div
                    className="
                        text-center
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                        "
                    >
                        Checkout session not found
                    </h2>


                    <p
                        className="
                            mt-2
                            text-gray-500
                        "
                    >
                        Please return to checkout
                        and try again.
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/cart")
                        }
                        className="
                            mt-5
                            rounded-lg
                            bg-black
                            px-5
                            py-2
                            text-white
                        "
                    >
                        Back to Cart
                    </button>

                </div>

            </div>
        );
    }


    // =========================
    // PAYMENT METHODS
    // =========================

    const paymentMethods = [

        {
            value: "COD",

            label:
                "Cash on Delivery",

            description:
                "Pay when your order is delivered."
        },

        {
            value: "UPI",

            label:
                "UPI",

            description:
                "Pay using your UPI app."
        },

        {
            value: "CARD",

            label:
                "Credit / Debit Card",

            description:
                "Pay securely using your card."
        },

        {
            value: "NET_BANKING",

            label:
                "Net Banking",

            description:
                "Pay using your bank account."
        }

    ];


    // =========================
    // SELECT PAYMENT METHOD
    // =========================

    const handleSelectMethod = (
        method
    ) => {

        setSelectedMethod(
            method
        );

        setError("");
        setSuccess("");
    };


    // =========================
    // PRICE FORMAT
    // =========================

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
        ).format(
            Number(amount || 0)
        );
    };


    // =========================
    // PRODUCT HELPERS
    // =========================

    const getProductName = (
        item
    ) => {

        const variant =
            item?.productVariant;


        const product =
            variant?.productId;


        return (
            product?.name ||
            product?.productName ||
            item?.productName ||
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


    // =========================
    // PAY NOW
    // =========================

    const handlePayNow = async () => {

        if (!selectedMethod) {

            toastError(
                "Please select a payment method"
            );

            return;
        }


        if (!checkout.addressId) {

            toastError(
                "Delivery address is missing"
            );

            return;
        }


        try {

            setLoading(true);

            setError("");
            setSuccess("");


            // ==================================================
            // COD
            // ==================================================

            if (
                selectedMethod === "COD"
            ) {

                let orderResponse;


                // =========================
                // CART ORDER
                // =========================

                if (
                    checkout.type === "cart"
                ) {

                    orderResponse =
                        await createCustomerCartOrder({
                            addressId:
                                checkout.addressId
                        });

                }


                // =========================
                // DIRECT ORDER
                // =========================

                else {

                    const item =
                        checkout.items[0];


                    if (!item) {

                        throw new Error(
                            "Checkout item not found"
                        );

                    }


                    orderResponse =
                        await createCustomerDirectOrder({

                            productVariantId:
                                item.productVariantId,

                            quantity:
                                item.quantity,

                            addressId:
                                checkout.addressId

                        });

                }


                const order =
                    orderResponse?.data;


                if (!order?._id) {

                    throw new Error(
                        "Order creation failed"
                    );

                }


                // =========================
                // CREATE COD PAYMENT
                // =========================

                await createCustomerPayment({

                    orderId:
                        order._id,

                    method:
                        "COD"

                });


                toastSuccess(
                    "Order placed successfully"
                );


                navigate(
                    "/my-orders",
                    {
                        replace: true
                    }
                );


                return;
            }


            // ==================================================
            // ONLINE PAYMENT
            // ==================================================

            /*
             * Do NOT create the order here yet.
             *
             * UPI / CARD / NET_BANKING will be
             * connected to the payment gateway later.
             *
             * Once the gateway reports SUCCESS,
             * we will create the order and payment
             * in the appropriate flow.
             */

            toastError(
                "Online payment is not connected yet"
            );

        }
        catch (err) {

            console.error(
                "Payment failed:",
                err
            );


            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to place order";


            setError(
                message
            );


            toastError(
                message
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="
                min-h-screen
                bg-gray-50
                py-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                "
            >

                {/* =========================
                    TITLE
                ========================= */}

                <h1
                    className="
                        mb-6
                        text-2xl
                        font-semibold
                    "
                >
                    Choose Payment Method
                </h1>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-6
                        lg:grid-cols-3
                    "
                >

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div
                        className="
                            space-y-4
                            lg:col-span-2
                        "
                    >

                        {/* =========================
                            ORDER DETAILS
                        ========================= */}

                        <div
                            className="
                                rounded-xl
                                border
                                bg-white
                                p-5
                            "
                        >

                            <h2
                                className="
                                    mb-4
                                    text-lg
                                    font-semibold
                                "
                            >
                                Order Details
                            </h2>


                            <div
                                className="
                                    space-y-4
                                "
                            >

                                {(
                                    checkout.displayItems ||
                                    []
                                ).map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const price =
                                            getSellingPrice(
                                                item
                                            );


                                        const quantity =
                                            Number(
                                                item.quantity ||
                                                1
                                            );


                                        return (

                                            <div
                                                key={
                                                    item
                                                        ?.productVariant
                                                        ?._id ||
                                                    item
                                                        ?.productVariantId ||
                                                    index
                                                }
                                                className="
                                                    flex
                                                    gap-4
                                                    border-b
                                                    pb-4
                                                    last:border-b-0
                                                    last:pb-0
                                                "
                                            >

                                                {/* IMAGE */}

                                                <div
                                                    className="
                                                        h-20
                                                        w-20
                                                        shrink-0
                                                        overflow-hidden
                                                        rounded-lg
                                                        bg-gray-100
                                                    "
                                                >

                                                    {getVariantImage(
                                                        item
                                                    ) ? (

                                                        <img
                                                            src={
                                                                getVariantImage(
                                                                    item
                                                                )
                                                            }
                                                            alt=""
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-contain
                                                            "
                                                        />

                                                    ) : (

                                                        <div
                                                            className="
                                                                flex
                                                                h-full
                                                                items-center
                                                                justify-center
                                                                text-xs
                                                                text-gray-400
                                                            "
                                                        >
                                                            No image
                                                        </div>

                                                    )}

                                                </div>


                                                {/* DETAILS */}

                                                <div
                                                    className="
                                                        min-w-0
                                                        flex-1
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            font-medium
                                                            text-gray-900
                                                        "
                                                    >
                                                        {
                                                            getProductName(
                                                                item
                                                            )
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-gray-500
                                                        "
                                                    >
                                                        Quantity:
                                                        {" "}
                                                        {quantity}
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-2
                                                            font-semibold
                                                        "
                                                    >
                                                        {
                                                            formatPrice(
                                                                price *
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


                        {/* =========================
                            DELIVERY ADDRESS
                        ========================= */}

                        {checkout.address && (

                            <div
                                className="
                                    rounded-xl
                                    border
                                    bg-white
                                    p-5
                                "
                            >

                                <h2
                                    className="
                                        mb-4
                                        text-lg
                                        font-semibold
                                    "
                                >
                                    Delivery Address
                                </h2>


                                <div
                                    className="
                                        rounded-lg
                                        bg-gray-50
                                        p-4
                                    "
                                >

                                    <p
                                        className="
                                            font-medium
                                        "
                                    >
                                        {
                                            checkout.address.name
                                        }
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-gray-600
                                        "
                                    >
                                        {
                                            checkout.address.phone
                                        }
                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-gray-600
                                        "
                                    >

                                        {
                                            [
                                                checkout.address.houseNo,
                                                checkout.address.addressLine1,
                                                checkout.address.addressLine2,
                                                checkout.address.area,
                                                checkout.address.city,
                                                checkout.address.state,
                                                checkout.address.postalCode,
                                                checkout.address.country
                                            ]
                                                .filter(Boolean)
                                                .join(", ")
                                        }

                                    </p>

                                </div>

                            </div>

                        )}


                        {/* =========================
                            PAYMENT METHODS
                        ========================= */}

                        <div
                            className="
                                rounded-xl
                                border
                                bg-white
                                p-5
                            "
                        >

                            <h2
                                className="
                                    mb-4
                                    text-lg
                                    font-semibold
                                "
                            >
                                Payment Method
                            </h2>


                            <div
                                className="
                                    space-y-3
                                "
                            >

                                {paymentMethods.map(
                                    method => {

                                        const isSelected =
                                            selectedMethod ===
                                            method.value;


                                        return (

                                            <button
                                                key={
                                                    method.value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSelectMethod(
                                                        method.value
                                                    )
                                                }
                                                className={`
                                                    w-full
                                                    rounded-lg
                                                    border
                                                    p-4
                                                    text-left
                                                    transition
                                                    ${
                                                        isSelected
                                                            ? "border-orange-500 bg-orange-50"
                                                            : "border-gray-200 hover:border-gray-400"
                                                    }
                                                `}
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-4
                                                    "
                                                >

                                                    <div>

                                                        <p
                                                            className="
                                                                font-medium
                                                            "
                                                        >
                                                            {
                                                                method.label
                                                            }
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-sm
                                                                text-gray-500
                                                            "
                                                        >
                                                            {
                                                                method.description
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className={`
                                                            mt-1
                                                            h-5
                                                            w-5
                                                            rounded-full
                                                            border
                                                            ${
                                                                isSelected
                                                                    ? "border-orange-500 bg-orange-500"
                                                                    : "border-gray-300"
                                                            }
                                                        `}
                                                    >

                                                        {isSelected && (

                                                            <div
                                                                className="
                                                                    m-1
                                                                    h-3
                                                                    w-3
                                                                    rounded-full
                                                                    bg-white
                                                                "
                                                            />

                                                        )}

                                                    </div>

                                                </div>

                                            </button>

                                        );

                                    }
                                )}

                            </div>


                            {/* ERROR */}

                            {error && (

                                <p
                                    className="
                                        mt-4
                                        text-sm
                                        text-red-600
                                    "
                                >
                                    {error}
                                </p>

                            )}


                            {/* SUCCESS */}

                            {success && (

                                <p
                                    className="
                                        mt-4
                                        text-sm
                                        text-green-600
                                    "
                                >
                                    {success}
                                </p>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <div>

                        <div
                            className="
                                sticky
                                top-6
                                rounded-xl
                                border
                                bg-white
                                p-5
                            "
                        >

                            <h2
                                className="
                                    mb-5
                                    text-lg
                                    font-semibold
                                "
                            >
                                Price Details
                            </h2>


                            <div
                                className="
                                    space-y-3
                                    text-sm
                                "
                            >

                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-gray-600
                                        "
                                    >
                                        Items
                                    </span>

                                    <span
                                        className="
                                            font-medium
                                        "
                                    >
                                        {
                                            checkout.items.reduce(
                                                (
                                                    total,
                                                    item
                                                ) =>
                                                    total +
                                                    Number(
                                                        item.quantity ||
                                                        1
                                                    ),
                                                0
                                            )
                                        }
                                    </span>

                                </div>


                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-gray-600
                                        "
                                    >
                                        Subtotal
                                    </span>

                                    <span>
                                        {
                                            formatPrice(
                                                checkout.subtotal
                                            )
                                        }
                                    </span>

                                </div>


                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-gray-600
                                        "
                                    >
                                        Discount
                                    </span>

                                    <span
                                        className="
                                            text-green-600
                                        "
                                    >
                                        -
                                        {
                                            formatPrice(
                                                checkout.discount
                                            )
                                        }
                                    </span>

                                </div>


                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-gray-600
                                        "
                                    >
                                        Delivery
                                    </span>

                                    <span>
                                        {
                                            checkout.deliveryCharge === 0
                                                ? "FREE"
                                                : formatPrice(
                                                    checkout.deliveryCharge
                                                )
                                        }
                                    </span>

                                </div>


                                <div
                                    className="
                                        my-4
                                        border-t
                                    "
                                />


                                <div
                                    className="
                                        flex
                                        justify-between
                                        text-base
                                    "
                                >

                                    <span
                                        className="
                                            font-semibold
                                        "
                                    >
                                        Total
                                    </span>

                                    <span
                                        className="
                                            text-xl
                                            font-bold
                                        "
                                    >
                                        {
                                            formatPrice(
                                                checkout.totalAmount
                                            )
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* =========================
                                PAY BUTTON
                            ========================= */}

                            {selectedMethod && (

                                <button
                                    type="button"
                                    onClick={
                                        handlePayNow
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="
                                        mt-6
                                        w-full
                                        rounded-lg
                                        bg-orange-500
                                        px-5
                                        py-3
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-orange-600
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {
                                        loading
                                            ? "Processing..."
                                            : selectedMethod === "COD"
                                                ? "Place Order"
                                                : "Pay Now"
                                    }

                                </button>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default Payment;