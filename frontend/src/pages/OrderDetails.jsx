import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    ArrowLeft,
    Check,
    Package,
    MapPin,
    CreditCard,
    Truck
} from "lucide-react";

import {
    getCustomerOrder
} from "../services/customer/orderService";


const OrderDetails = () => {

    const {
        orderId
    } = useParams();

    const navigate = useNavigate();


    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadOrder = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getCustomerOrder(
                        orderId
                    );


                setOrder(
                    response?.data || null
                );

            }
            catch (err) {

                console.error(
                    "Failed to load order:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load order"
                );

            }
            finally {

                setLoading(false);

            }

        };


        if (orderId) {
            loadOrder();
        }

    }, [orderId]);


    const formatPrice = (price) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(price || 0);

    };


    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    const getProgress = (
        orderStatus
    ) => {

        const steps = [
            {
                key: "RECEIVED",
                label: "Order Received",
                description:
                    "Your order has been received."
            },
            {
                key: "CONFIRMED",
                label: "Order Confirmed",
                description:
                    "Your order has been confirmed."
            },
            {
                key: "PACKED",
                label: "Packed",
                description:
                    "Your order is being packed."
            },
            {
                key: "SHIPPED",
                label: "Shipped",
                description:
                    "Your order has been shipped."
            },
            {
                key: "OUT_FOR_DELIVERY",
                label: "Out for Delivery",
                description:
                    "Your order is out for delivery."
            },
            {
                key: "DELIVERED",
                label: "Delivered",
                description:
                    "Your order has been delivered."
            }
        ];


        if (
            orderStatus ===
            "CANCELLED"
        ) {

            return {
                cancelled: true,
                steps
            };

        }


        let currentIndex = 0;


        switch (orderStatus) {

            case "PENDING":

                currentIndex = 0;
                break;

            case "CONFIRMED":

                currentIndex = 1;
                break;

            default:

                currentIndex = 0;
                break;

        }


        return {
            cancelled: false,
            steps,
            currentIndex
        };

    };


    if (loading) {

        return (

            <div className="
                min-h-screen
                bg-gray-100
                px-4
                py-8
            ">

                <div className="
                    mx-auto
                    max-w-5xl
                ">

                    <div className="
                        h-8
                        w-48
                        animate-pulse
                        rounded
                        bg-gray-200
                    " />

                    <div className="
                        mt-6
                        h-72
                        animate-pulse
                        rounded-lg
                        bg-white
                    " />

                </div>

            </div>

        );

    }


    if (error || !order) {

        return (

            <div className="
                min-h-screen
                bg-gray-100
                px-4
                py-8
            ">

                <div className="
                    mx-auto
                    max-w-5xl
                ">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/my-orders"
                            )
                        }
                        className="
                            mb-5
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-gray-600
                            hover:text-gray-900
                        "
                    >

                        <ArrowLeft
                            size={18}
                        />

                        My Orders

                    </button>


                    <div className="
                        rounded-lg
                        bg-white
                        p-10
                        text-center
                    ">

                        <p className="
                            text-sm
                            text-red-600
                        ">
                            {
                                error ||
                                "Order not found"
                            }
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    const progress =
        getProgress(
            order.status
        );


    const items =
        order.items || [];


    return (

        <div className="
            min-h-screen
            bg-gray-100
            px-4
            py-8
        ">

            <div className="
                mx-auto
                max-w-5xl
            ">


                {/* Back */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/my-orders"
                        )
                    }
                    className="
                        mb-5
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-gray-600
                        hover:text-gray-900
                    "
                >

                    <ArrowLeft
                        size={18}
                    />

                    My Orders

                </button>


                {/* Header */}

                <div className="
                    rounded-lg
                    bg-white
                    p-5
                    shadow-sm
                ">

                    <div className="
                        flex
                        flex-col
                        gap-3
                        md:flex-row
                        md:items-center
                        md:justify-between
                    ">

                        <div>

                            <h1 className="
                                text-xl
                                font-semibold
                                text-gray-800
                            ">
                                Order Details
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-gray-500
                            ">
                                Order #
                                {" "}
                                {
                                    order.orderNumber
                                }
                            </p>

                        </div>


                        <div className="
                            text-left
                            md:text-right
                        ">

                            <p className="
                                text-xs
                                text-gray-500
                            ">
                                Ordered on
                            </p>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-800
                            ">
                                {
                                    formatDate(
                                        order.createdAt
                                    )
                                }
                            </p>

                        </div>

                    </div>

                </div>


                {/* Progress */}

                <div className="
                    mt-4
                    rounded-lg
                    bg-white
                    p-6
                    shadow-sm
                ">

                    <div className="
                        mb-6
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-orange-50
                        ">

                            <Truck
                                size={21}
                                className="
                                    text-orange-500
                                "
                            />

                        </div>


                        <div>

                            <h2 className="
                                font-semibold
                                text-gray-800
                            ">
                                Order Status
                            </h2>

                            <p className="
                                text-xs
                                text-gray-500
                            ">
                                Track your order progress
                            </p>

                        </div>

                    </div>


                    {progress.cancelled ? (

                        <div className="
                            rounded-lg
                            border
                            border-red-100
                            bg-red-50
                            p-4
                        ">

                            <p className="
                                font-semibold
                                text-red-600
                            ">
                                Order Cancelled
                            </p>

                            <p className="
                                mt-1
                                text-sm
                                text-red-500
                            ">
                                This order has been cancelled.
                            </p>

                        </div>

                    ) : (

                        <div className="
                            relative
                        ">

                            {progress.steps.map(
                                (
                                    step,
                                    index
                                ) => {

                                    const completed =
                                        index <
                                        progress.currentIndex;

                                    const current =
                                        index ===
                                        progress.currentIndex;

                                    const next =
                                        index ===
                                        progress.currentIndex + 1;


                                    /*
                                     * For the first version,
                                     * show the current and next
                                     * step prominently.
                                     *
                                     * Later shipment status will
                                     * determine the remaining
                                     * progress.
                                     */

                                    if (
                                        !current &&
                                        !next
                                    ) {
                                        return null;
                                    }


                                    return (

                                        <div
                                            key={
                                                step.key
                                            }
                                            className="
                                                relative
                                                flex
                                                gap-4
                                            "
                                        >

                                            <div className="
                                                flex
                                                flex-col
                                                items-center
                                            ">

                                                <div
                                                    className={`
                                                        flex
                                                        h-8
                                                        w-8
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        ${
                                                            completed ||
                                                            current
                                                                ? "bg-orange-500 text-white"
                                                                : "border-2 border-gray-300 bg-white text-gray-400"
                                                        }
                                                    `}
                                                >

                                                    {completed ? (

                                                        <Check
                                                            size={16}
                                                        />

                                                    ) : (

                                                        <span className="
                                                            text-xs
                                                            font-semibold
                                                        ">
                                                            {
                                                                index + 1
                                                            }
                                                        </span>

                                                    )}

                                                </div>


                                                {index <
                                                    progress.currentIndex + 1 && (

                                                    <div className="
                                                        h-14
                                                        w-px
                                                        bg-gray-200
                                                    " />

                                                )}

                                            </div>


                                            <div className="
                                                pb-7
                                            ">

                                                <p className={`
                                                    text-sm
                                                    font-semibold
                                                    ${
                                                        current
                                                            ? "text-gray-800"
                                                            : "text-gray-500"
                                                    }
                                                `}>

                                                    {
                                                        step.label
                                                    }

                                                </p>


                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-gray-500
                                                ">

                                                    {
                                                        step.description
                                                    }

                                                </p>


                                                {current &&
                                                    order.status ===
                                                    "PENDING" && (

                                                    <p className="
                                                        mt-2
                                                        text-xs
                                                        text-gray-400
                                                    ">
                                                        Waiting for confirmation.
                                                        This may take up to 3 days.
                                                    </p>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>


                {/* Products */}

                <div className="
                    mt-4
                    rounded-lg
                    bg-white
                    p-5
                    shadow-sm
                ">

                    <div className="
                        mb-5
                        flex
                        items-center
                        gap-2
                    ">

                        <Package
                            size={20}
                            className="
                                text-orange-500
                            "
                        />

                        <h2 className="
                            font-semibold
                            text-gray-800
                        ">
                            Items in this order
                        </h2>

                    </div>


                    <div className="
                        divide-y
                        divide-gray-100
                    ">

                        {items.map(
                            (item, index) => (

                                <div
                                    key={
                                        item.productVariantId ||
                                        index
                                    }
                                    className="
                                        flex
                                        gap-4
                                        py-4
                                    "
                                >

                                    <div className="
                                        flex
                                        h-20
                                        w-20
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-gray-50
                                    ">

                                        {item.productImage?.url ? (

                                            <img
                                                src={item.productImage.url}
                                                alt={
                                                    item.productName ||
                                                    "Product"
                                                }
                                                className="
                                                    h-full
                                                    w-full
                                                    object-contain
                                                    p-2
                                                "
                                            />

                                        ) : (

                                            <Package
                                                size={34}
                                                className="text-gray-400"
                                                strokeWidth={1.5}
                                            />

                                        )}

                                    </div>


                                    <div className="
                                        min-w-0
                                        flex-1
                                    ">

                                        <h3 className="
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                        ">
                                            {
                                                item.productName
                                            }
                                        </h3>


                                        <p className="
                                            mt-1
                                            text-xs
                                            text-gray-500
                                        ">
                                            Qty:{" "}
                                            {
                                                item.quantity
                                            }
                                        </p>


                                        {item.sku && (

                                            <p className="
                                                mt-1
                                                truncate
                                                text-xs
                                                text-gray-400
                                            ">
                                                SKU:{" "}
                                                {
                                                    item.sku
                                                }
                                            </p>

                                        )}

                                    </div>


                                    <div className="
                                        shrink-0
                                        text-right
                                    ">

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                        ">
                                            {
                                                formatPrice(
                                                    item.totalPrice
                                                )
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-gray-400
                                        ">
                                            {
                                                formatPrice(
                                                    item.unitPrice
                                                )
                                            }{" "}
                                            each
                                        </p>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* Bottom information */}

                <div className="
                    mt-4
                    grid
                    gap-4
                    md:grid-cols-2
                ">


                    {/* Delivery Address */}

                    <div className="
                        rounded-lg
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            mb-4
                            flex
                            items-center
                            gap-2
                        ">

                            <MapPin
                                size={19}
                                className="
                                    text-orange-500
                                "
                            />

                            <h2 className="
                                font-semibold
                                text-gray-800
                            ">
                                Delivery Address
                            </h2>

                        </div>


                        <div className="
                            text-sm
                            leading-6
                            text-gray-600
                        ">

                            <p className="
                                font-medium
                                text-gray-800
                            ">
                                {
                                    order.shippingAddress?.name
                                }
                            </p>

                            <p>
                                {
                                    order.shippingAddress?.houseNo
                                }
                                {", "}
                                {
                                    order.shippingAddress?.addressLine1
                                }
                            </p>

                            {order.shippingAddress?.addressLine2 && (

                                <p>
                                    {
                                        order.shippingAddress.addressLine2
                                    }
                                </p>

                            )}

                            <p>
                                {
                                    order.shippingAddress?.area
                                },{" "}
                                {
                                    order.shippingAddress?.city
                                }
                            </p>

                            <p>
                                {
                                    order.shippingAddress?.state
                                }{" "}
                                -{" "}
                                {
                                    order.shippingAddress?.postalCode
                                }
                            </p>

                            <p className="
                                mt-1
                            ">
                                Phone:{" "}
                                {
                                    order.shippingAddress?.phone
                                }
                            </p>

                        </div>

                    </div>


                    {/* Price Details */}

                    <div className="
                        rounded-lg
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            mb-4
                            flex
                            items-center
                            gap-2
                        ">

                            <CreditCard
                                size={19}
                                className="
                                    text-orange-500
                                "
                            />

                            <h2 className="
                                font-semibold
                                text-gray-800
                            ">
                                Price Details
                            </h2>

                        </div>


                        <div className="
                            space-y-3
                            text-sm
                        ">

                            <div className="
                                flex
                                justify-between
                                text-gray-600
                            ">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    {
                                        formatPrice(
                                            order.subtotal
                                        )
                                    }
                                </span>

                            </div>


                            <div className="
                                flex
                                justify-between
                                text-gray-600
                            ">

                                <span>
                                    Discount
                                </span>

                                <span className="
                                    text-green-600
                                ">
                                    -
                                    {
                                        formatPrice(
                                            order.discountAmount
                                        )
                                    }
                                </span>

                            </div>


                            <div className="
                                flex
                                justify-between
                                text-gray-600
                            ">

                                <span>
                                    Delivery Fee
                                </span>

                                <span>
                                    {
                                        formatPrice(
                                            order.shippingCharge
                                        )
                                    }
                                </span>

                            </div>


                            <div className="
                                border-t
                                border-gray-100
                                pt-3
                                flex
                                justify-between
                                font-semibold
                                text-gray-800
                            ">

                                <span>
                                    Total
                                </span>

                                <span>
                                    {
                                        formatPrice(
                                            order.totalAmount
                                        )
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default OrderDetails;