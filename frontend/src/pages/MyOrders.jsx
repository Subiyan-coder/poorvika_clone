import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ShoppingBag,
    ChevronRight
} from "lucide-react";

import {
    getCustomerOrders
} from "../services/customer/orderService";


const MyOrders = () => {

    const navigate = useNavigate();


    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const loadOrders = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getCustomerOrders();


                setOrders(
                    response?.data || []
                );

            }
            catch (err) {

                console.error(
                    "Failed to load orders:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load your orders"
                );

            }
            finally {

                setLoading(false);

            }

        };


        loadOrders();

    }, []);


    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


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


    const getStatusInfo = (status) => {

        switch (status) {

            case "PENDING":

                return {
                    current: "Order Received",
                    next: "Order Confirmed",
                    message:
                        "Waiting for confirmation. This may take up to 3 days."
                };


            case "CONFIRMED":

                return {
                    current: "Order Confirmed",
                    next: "Packed",
                    message:
                        "Your order has been confirmed."
                };


            case "CANCELLED":

                return {
                    current: "Order Cancelled",
                    next: null,
                    message:
                        "This order has been cancelled."
                };


            default:

                return {
                    current: status || "Order Received",
                    next: null,
                    message:
                        "Your order is being processed."
                };

        }

    };


    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100 px-4 py-8">

                <div className="mx-auto max-w-6xl">

                    <div className="mb-6 h-8 w-40 animate-pulse rounded bg-gray-200" />

                    <div className="space-y-4">

                        {[1, 2, 3].map(
                            (item) => (

                                <div
                                    key={item}
                                    className="
                                        h-48
                                        animate-pulse
                                        rounded-lg
                                        bg-white
                                    "
                                />

                            )
                        )}

                    </div>

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="min-h-screen bg-gray-100 px-4 py-8">

                <div className="mx-auto max-w-6xl">

                    <div className="
                        rounded-lg
                        border
                        border-red-200
                        bg-white
                        p-8
                        text-center
                    ">

                        <p className="
                            text-sm
                            text-red-600
                        ">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="
                                mt-4
                                rounded-lg
                                bg-orange-500
                                px-5
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-orange-600
                            "
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    if (orders.length === 0) {

        return (

            <div className="min-h-screen bg-gray-100 px-4 py-8">

                <div className="mx-auto max-w-6xl">

                    <div className="
                        overflow-hidden
                        rounded-lg
                        bg-white
                        shadow-sm
                    ">

                        <div className="
                            flex
                            min-h-[480px]
                            flex-col
                            items-center
                            justify-center
                            px-6
                            text-center
                        ">

                            <div className="
                                mb-6
                                flex
                                h-28
                                w-28
                                items-center
                                justify-center
                                rounded-full
                                bg-orange-50
                            ">

                                <ShoppingBag
                                    size={64}
                                    strokeWidth={1.5}
                                    className="text-orange-500"
                                />

                            </div>


                            <h2 className="
                                text-xl
                                font-semibold
                                text-gray-800
                            ">
                                Your orders are empty!
                            </h2>


                            <p className="
                                mt-2
                                max-w-md
                                text-sm
                                text-gray-500
                            ">
                                You haven't placed any orders yet.
                                Start shopping to see your orders here.
                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/")
                                }
                                className="
                                    mt-6
                                    rounded-lg
                                    bg-orange-500
                                    px-8
                                    py-3
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-orange-600
                                "
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-100 px-4 py-8">

            <div className="mx-auto max-w-6xl">


                {/* Page Header */}

                <div className="
                    mb-6
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <h1 className="
                            text-2xl
                            font-semibold
                            text-gray-800
                        ">
                            My Orders
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            {orders.length}{" "}
                            {orders.length === 1
                                ? "order"
                                : "orders"}
                        </p>

                    </div>

                </div>


                {/* Orders */}

                <div className="space-y-4">

                    {orders.map(
                        (order) => {

                            const status =
                                getStatusInfo(
                                    order.status
                                );


                            const firstItem =
                                order.items?.[0];


                            return (

                                <div
                                    key={order._id}
                                    className="
                                        overflow-hidden
                                        rounded-lg
                                        border
                                        border-gray-200
                                        bg-white
                                        shadow-sm
                                        transition
                                        hover:shadow-md
                                    "
                                >

                                    {/* Order Header */}

                                    <div className="
                                        flex
                                        flex-wrap
                                        items-center
                                        justify-between
                                        gap-3
                                        border-b
                                        border-gray-100
                                        bg-gray-50
                                        px-5
                                        py-3
                                    ">

                                        <div>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                            ">
                                                Order placed
                                            </p>

                                            <p className="
                                                text-sm
                                                font-medium
                                                text-gray-800
                                            ">
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                            ">
                                                Order ID
                                            </p>

                                            <p className="
                                                text-sm
                                                font-medium
                                                text-gray-800
                                            ">
                                                {order.orderNumber}
                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                            ">
                                                Total
                                            </p>

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-800
                                            ">
                                                {formatPrice(
                                                    order.totalAmount
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Main Order */}

                                    <div className="
                                        flex
                                        flex-col
                                        gap-6
                                        p-5
                                        md:flex-row
                                        md:items-center
                                    ">


                                        {/* Product */}

                                        <div className="
                                            flex
                                            min-w-0
                                            flex-1
                                            gap-4
                                        ">

                                            <div className="
                                                flex
                                                h-24
                                                w-24
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-gray-50
                                            ">

                                                {firstItem?.productImage?.url ? (

                                                    <img
                                                        src={firstItem.productImage.url}
                                                        alt={
                                                            firstItem.productName ||
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

                                                    <ShoppingBag
                                                        size={42}
                                                        strokeWidth={1.5}
                                                        className="text-gray-400"
                                                    />

                                                )}

                                            </div>


                                            <div className="min-w-0">

                                                <h2 className="
                                                    line-clamp-2
                                                    text-sm
                                                    font-semibold
                                                    text-gray-800
                                                ">
                                                    {
                                                        firstItem?.productName ||
                                                        "Product"
                                                    }
                                                </h2>


                                                <p className="
                                                    mt-2
                                                    text-sm
                                                    text-gray-500
                                                ">
                                                    Qty:{" "}
                                                    {
                                                        firstItem?.quantity ||
                                                        0
                                                    }
                                                </p>


                                                {firstItem?.sku && (

                                                    <p className="
                                                        mt-1
                                                        truncate
                                                        text-xs
                                                        text-gray-400
                                                    ">
                                                        SKU:{" "}
                                                        {
                                                            firstItem.sku
                                                        }
                                                    </p>

                                                )}

                                            </div>

                                        </div>


                                        {/* Status */}

                                        <div className="
                                            min-w-0
                                            flex-1
                                        ">

                                            <div className="
                                                flex
                                                items-start
                                                gap-3
                                            ">

                                                <div className="
                                                    mt-1
                                                    h-3
                                                    w-3
                                                    shrink-0
                                                    rounded-full
                                                    bg-orange-500
                                                "/>

                                                <div>

                                                    <p className="
                                                        text-sm
                                                        font-semibold
                                                        text-gray-800
                                                    ">
                                                        {
                                                            status.current
                                                        }
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-gray-500
                                                    ">
                                                        {
                                                            status.message
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            {status.next && (

                                                <div className="
                                                    ml-[5px]
                                                    mt-3
                                                    border-l
                                                    border-dashed
                                                    border-gray-300
                                                    pl-5
                                                ">

                                                    <p className="
                                                        text-xs
                                                        font-medium
                                                        text-gray-400
                                                    ">
                                                        Next
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        text-sm
                                                        text-gray-500
                                                    ">
                                                        {
                                                            status.next
                                                        }
                                                    </p>

                                                </div>

                                            )}

                                        </div>


                                        {/* View Order */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/my-orders/${order._id}`
                                                )
                                            }
                                            className="
                                                flex
                                                shrink-0
                                                items-center
                                                gap-1
                                                rounded-lg
                                                border
                                                border-gray-200
                                                px-4
                                                py-2
                                                text-sm
                                                font-medium
                                                text-orange-600
                                                transition
                                                hover:bg-orange-50
                                            "
                                        >

                                            View Order

                                            <ChevronRight
                                                size={17}
                                            />

                                        </button>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>

        </div>

    );

};


export default MyOrders;