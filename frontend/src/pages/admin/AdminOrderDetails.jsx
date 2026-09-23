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
    Package,
    MapPin,
    User,
    Calendar,
    IndianRupee
} from "lucide-react";

import {
    getAdminOrder
} from "../../services/admin/adminOrderService";


const AdminOrderDetails = () => {

    const {
        orderId
    } = useParams();

    const navigate =
        useNavigate();


    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // -------------------------
    // Load Order
    // -------------------------

    useEffect(() => {

        const loadOrder =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await getAdminOrder(
                            orderId
                        );


                    setOrder(
                        response.data
                    );

                }
                catch (err) {

                    console.error(
                        "Failed to load admin order:",
                        err
                    );


                    setError(
                        err?.response?.data?.message ||
                        "Unable to load order."
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


    // -------------------------
    // Loading
    // -------------------------

    if (loading) {

        return (

            <div className="
                flex
                min-h-[400px]
                items-center
                justify-center
                text-sm
                text-gray-500
            ">

                Loading order...

            </div>

        );

    }


    // -------------------------
    // Error
    // -------------------------

    if (error || !order) {

        return (

            <div className="
                space-y-4
            ">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/orders"
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        text-gray-600
                        hover:text-gray-900
                    "
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back to Orders

                </button>


                <div className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-4
                    text-sm
                    text-red-700
                ">

                    {error ||
                        "Order not found."}

                </div>

            </div>

        );

    }


    // -------------------------
    // Helpers
    // -------------------------

    const formatDate = (
        value
    ) => {

        if (!value) {

            return "-";

        }

        return new Date(
            value
        ).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    const formatPrice = (
        value
    ) => {

        return Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    const getStatusClass =
        (status) => {

            switch (status) {

                case "CONFIRMED":

                    return "bg-blue-100 text-blue-700";

                case "SHIPPED":

                    return "bg-purple-100 text-purple-700";

                case "DELIVERED":

                    return "bg-green-100 text-green-700";

                case "CANCELLED":

                    return "bg-red-100 text-red-700";

                case "RETURNED":

                    return "bg-orange-100 text-orange-700";

                case "PENDING":

                default:

                    return "bg-yellow-100 text-yellow-700";

            }

        };


    return (

        <div className="
            space-y-6
        ">


            {/* =========================
                Header
            ========================= */}

            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/orders"
                            )
                        }
                        className="
                            mb-3
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                            hover:text-gray-900
                        "
                    >

                        <ArrowLeft
                            size={17}
                        />

                        Back to Orders

                    </button>


                    <h1 className="
                        text-2xl
                        font-semibold
                        text-gray-900
                    ">

                        Order Details

                    </h1>


                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">

                        {order.orderNumber}

                    </p>

                </div>


                <span className={`
                    inline-flex
                    w-fit
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-medium
                    ${getStatusClass(
                        order.status
                    )}
                `}>

                    {order.status}

                </span>

            </div>


            {/* =========================
                Order Information
            ========================= */}

            <div className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-3
            ">

                <InfoCard
                    icon={Package}
                    title="Order Number"
                    value={
                        order.orderNumber
                    }
                />


                <InfoCard
                    icon={Calendar}
                    title="Created"
                    value={
                        formatDate(
                            order.createdAt
                        )
                    }
                />


                <InfoCard
                    icon={Calendar}
                    title="Last Updated"
                    value={
                        formatDate(
                            order.updatedAt
                        )
                    }
                />

            </div>


            {/* =========================
                Customer
            ========================= */}

            <Section
                icon={User}
                title="Customer"
            >

                <div className="
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                ">

                    <Detail
                        label="User ID"
                        value={
                            order.userId
                        }
                    />

                    <Detail
                        label="Order Placed"
                        value={
                            formatDate(
                                order.placedAt
                            )
                        }
                    />

                </div>

            </Section>


            {/* =========================
                Shipping Address
            ========================= */}

            <Section
                icon={MapPin}
                title="Shipping Address"
            >

                <div className="
                    space-y-1
                    text-sm
                    text-gray-700
                ">

                    <p className="
                        font-medium
                        text-gray-900
                    ">

                        {
                            order.shippingAddress?.name
                        }

                    </p>


                    <p>

                        {
                            order.shippingAddress?.phone
                        }

                    </p>


                    {
                        order.shippingAddress
                            ?.alternativePhone && (

                            <p>

                                {
                                    order.shippingAddress
                                        .alternativePhone
                                }

                            </p>

                        )
                    }


                    <p>

                        {
                            [
                                order.shippingAddress
                                    ?.houseNo,

                                order.shippingAddress
                                    ?.addressLine1,

                                order.shippingAddress
                                    ?.addressLine2,

                                order.shippingAddress
                                    ?.area
                            ]
                                .filter(Boolean)
                                .join(", ")
                        }

                    </p>


                    <p>

                        {
                            [
                                order.shippingAddress
                                    ?.city,

                                order.shippingAddress
                                    ?.state,

                                order.shippingAddress
                                    ?.postalCode,

                                order.shippingAddress
                                    ?.country
                            ]
                                .filter(Boolean)
                                .join(", ")
                        }

                    </p>

                </div>

            </Section>


            {/* =========================
                Items
            ========================= */}

            <Section
                icon={Package}
                title={
                    `Items (${order.items?.length || 0})`
                }
            >

                <div className="
                    divide-y
                    divide-gray-100
                ">

                    {
                        order.items?.map(
                            (
                                item,
                                index
                            ) => (

                                <div
                                    key={
                                        item.productVariantId ||
                                        index
                                    }
                                    className="
                                        flex
                                        gap-4
                                        py-5
                                        first:pt-0
                                        last:pb-0
                                    "
                                >

                                    {/* Image */}

                                    <div className="
                                        h-24
                                        w-24
                                        shrink-0
                                        overflow-hidden
                                        rounded-lg
                                        border
                                        border-gray-200
                                        bg-gray-50
                                    ">

                                        {
                                            item.productImage
                                                ?.url ? (

                                                <img
                                                    src={
                                                        item.productImage.url
                                                    }
                                                    alt={
                                                        item.productName
                                                    }
                                                    className="
                                                        h-full
                                                        w-full
                                                        object-contain
                                                    "
                                                />

                                            ) : (

                                                <div className="
                                                    flex
                                                    h-full
                                                    items-center
                                                    justify-center
                                                    text-xs
                                                    text-gray-400
                                                ">

                                                    No Image

                                                </div>

                                            )
                                        }

                                    </div>


                                    {/* Details */}

                                    <div className="
                                        min-w-0
                                        flex-1
                                    ">

                                        <h3 className="
                                            font-medium
                                            text-gray-900
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

                                            SKU: {
                                                item.sku
                                            }

                                        </p>


                                        {
                                            item.attributes &&
                                            Object.keys(
                                                item.attributes
                                            ).length > 0 && (

                                                <div className="
                                                    mt-2
                                                    flex
                                                    flex-wrap
                                                    gap-2
                                                ">

                                                    {
                                                        Object.entries(
                                                            item.attributes
                                                        ).map(
                                                            ([
                                                                key,
                                                                value
                                                            ]) => (

                                                                <span
                                                                    key={
                                                                        key
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

                                                                    {key}: {value}

                                                                </span>

                                                            )
                                                        )
                                                    }

                                                </div>

                                            )
                                        }


                                        <p className="
                                            mt-2
                                            text-sm
                                            text-gray-500
                                        ">

                                            Qty: {
                                                item.quantity
                                            }

                                        </p>

                                    </div>


                                    {/* Price */}

                                    <div className="
                                        shrink-0
                                        text-right
                                    ">

                                        <p className="
                                            font-medium
                                            text-gray-900
                                        ">

                                            ₹{
                                                formatPrice(
                                                    item.totalPrice
                                                )
                                            }

                                        </p>


                                        <p className="
                                            mt-1
                                            text-xs
                                            text-gray-500
                                        ">

                                            ₹{
                                                formatPrice(
                                                    item.unitPrice
                                                )
                                            } each

                                        </p>

                                    </div>

                                </div>

                            )
                        )
                    }

                </div>

            </Section>


            {/* =========================
                Price Summary
            ========================= */}

            <Section
                icon={IndianRupee}
                title="Price Summary"
            >

                <div className="
                    ml-auto
                    w-full
                    max-w-md
                    space-y-3
                    text-sm
                ">

                    <PriceRow
                        label="Subtotal"
                        value={
                            order.subtotal
                        }
                    />


                    <PriceRow
                        label="Discount"
                        value={
                            order.discountAmount
                        }
                        negative
                    />


                    <PriceRow
                        label="Shipping"
                        value={
                            order.shippingCharge
                        }
                    />


                    {
                        order.couponCode && (

                            <div className="
                                flex
                                justify-between
                                text-sm
                            ">

                                <span className="
                                    text-gray-500
                                ">

                                    Coupon

                                </span>

                                <span className="
                                    font-medium
                                    text-gray-700
                                ">

                                    {
                                        order.couponCode
                                    }

                                </span>

                            </div>

                        )
                    }


                    <div className="
                        border-t
                        border-gray-200
                        pt-3
                    ">

                        <PriceRow
                            label="Total"
                            value={
                                order.totalAmount
                            }
                            strong
                        />

                    </div>

                </div>

            </Section>


            {/* =========================
                Order Dates
            ========================= */}

            <Section
                icon={Calendar}
                title="Order Timeline"
            >

                <div className="
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    lg:grid-cols-3
                ">

                    <Detail
                        label="Placed At"
                        value={
                            formatDate(
                                order.placedAt
                            )
                        }
                    />

                    <Detail
                        label="Created At"
                        value={
                            formatDate(
                                order.createdAt
                            )
                        }
                    />

                    <Detail
                        label="Updated At"
                        value={
                            formatDate(
                                order.updatedAt
                            )
                        }
                    />

                    <Detail
                        label="Delivered At"
                        value={
                            formatDate(
                                order.deliveredAt
                            )
                        }
                    />

                    <Detail
                        label="Return Deadline"
                        value={
                            formatDate(
                                order.returnDeadline
                            )
                        }
                    />

                    <Detail
                        label="Cancelled At"
                        value={
                            formatDate(
                                order.cancelledAt
                            )
                        }
                    />

                </div>


                {
                    order.cancellationReason && (

                        <div className="
                            mt-5
                            rounded-lg
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        ">

                            <span className="
                                font-medium
                            ">

                                Cancellation Reason:

                            </span>{" "}

                            {
                                order.cancellationReason
                            }

                        </div>

                    )
                }

            </Section>

        </div>

    );

};


// =========================
// Small Components
// =========================

const InfoCard = ({
    icon: Icon,
    title,
    value
}) => {

    return (

        <div className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-4
        ">

            <div className="
                flex
                items-center
                gap-2
                text-gray-500
            ">

                <Icon
                    size={17}
                />

                <span className="
                    text-xs
                ">

                    {title}

                </span>

            </div>


            <p className="
                mt-2
                break-all
                text-sm
                font-medium
                text-gray-900
            ">

                {value}

            </p>

        </div>

    );

};


const Section = ({
    icon: Icon,
    title,
    children
}) => {

    return (

        <section className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            sm:p-6
        ">

            <div className="
                mb-5
                flex
                items-center
                gap-2
            ">

                <Icon
                    size={19}
                    className="text-gray-600"
                />

                <h2 className="
                    text-base
                    font-semibold
                    text-gray-900
                ">

                    {title}

                </h2>

            </div>


            {children}

        </section>

    );

};


const Detail = ({
    label,
    value
}) => {

    return (

        <div>

            <p className="
                text-xs
                text-gray-500
            ">

                {label}

            </p>

            <p className="
                mt-1
                break-all
                text-sm
                text-gray-900
            ">

                {value || "-"}

            </p>

        </div>

    );

};


const PriceRow = ({
    label,
    value,
    negative = false,
    strong = false
}) => {

    return (

        <div className={`
            flex
            items-center
            justify-between
            ${strong
                ? "text-base font-semibold"
                : ""}
        `}>

            <span className="
                text-gray-500
            ">

                {label}

            </span>


            <span className={`
                ${negative
                    ? "text-green-600"
                    : "text-gray-900"}
            `}>

                {negative
                    ? "- "
                    : ""}

                ₹{
                    Number(
                        value || 0
                    ).toLocaleString(
                        "en-IN",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )
                }

            </span>

        </div>

    );

};


export default AdminOrderDetails;