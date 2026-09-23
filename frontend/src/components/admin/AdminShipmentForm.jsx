import {
    useEffect,
    useState
} from "react";


const STATUS_TRANSITIONS = {

    PENDING: [
        "PACKED",
        "FAILED"
    ],

    PACKED: [
        "SHIPPED",
        "FAILED"
    ],

    SHIPPED: [
        "OUT_FOR_DELIVERY",
        "FAILED"
    ],

    OUT_FOR_DELIVERY: [
        "DELIVERED",
        "FAILED"
    ],

    DELIVERED: [],

    FAILED: []

};


const STATUS_LABELS = {

    PENDING: "Pending",

    PACKED: "Packed",

    SHIPPED: "Shipped",

    OUT_FOR_DELIVERY:
        "Out for Delivery",

    DELIVERED: "Delivered",

    FAILED: "Failed"

};


const AdminShipmentForm = ({
    shipment,
    onSubmit,
    onCancel,
    loading = false
}) => {

    const [formData, setFormData] =
        useState({

            status: "",

            carrier: "",

            trackingNumber: ""

        });


    useEffect(() => {

        if (!shipment) {
            return;
        }


        setFormData({

            status:
                shipment.status || "",

            carrier:
                shipment.carrier || "",

            trackingNumber:
                shipment.trackingNumber || ""

        });

    }, [shipment]);


    if (!shipment) {
        return null;
    }


    const currentStatus =
        shipment.status;


    const allowedStatuses =
        STATUS_TRANSITIONS[
            currentStatus
        ] || [];


    const handleChange =
        (event) => {

            const {
                name,
                value
            } = event.target;


            setFormData(
                previous => ({

                    ...previous,

                    [name]: value

                })
            );

        };


    const handleSubmit =
        async (event) => {

            event.preventDefault();


            await onSubmit({

                status:
                    formData.status,

                carrier:
                    formData.carrier.trim(),

                trackingNumber:
                    formData.trackingNumber.trim()

            });

        };


    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            {/* =========================
                Order Information
            ========================= */}

            <div className="
                admin-card
                p-4
            ">

                <div className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                ">

                    <div>

                        <p className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-gray-500
                        ">
                            Order
                        </p>

                        <p className="
                            mt-1
                            text-sm
                            font-medium
                            text-gray-900
                        ">
                            {
                                shipment
                                    .orderId
                                    ?.orderNumber ||
                                "-"
                            }
                        </p>

                    </div>


                    <div>

                        <p className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-gray-500
                        ">
                            Current Status
                        </p>

                        <p className="
                            mt-1
                            text-sm
                            font-medium
                            text-gray-900
                        ">
                            {
                                STATUS_LABELS[
                                    currentStatus
                                ] ||
                                currentStatus ||
                                "-"
                            }
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                Status
            ========================= */}

            <div>

                <label
                    htmlFor="shipment-status"
                    className="
                        mb-1.5
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    "
                >
                    Status
                </label>


                <select
                    id="shipment-status"
                    name="status"
                    value={
                        formData.status
                    }
                    onChange={
                        handleChange
                    }
                    disabled={
                        loading ||
                        allowedStatuses.length === 0
                    }
                    className="
                        admin-select
                        w-full
                    "
                >

                    <option
                        value={
                            currentStatus
                        }
                    >
                        {
                            STATUS_LABELS[
                                currentStatus
                            ] ||
                            currentStatus
                        }
                    </option>


                    {allowedStatuses.map(
                        status => (

                            <option
                                key={status}
                                value={status}
                            >
                                {
                                    STATUS_LABELS[
                                        status
                                    ]
                                }
                            </option>

                        )
                    )}

                </select>


                {allowedStatuses.length === 0 && (

                    <p className="
                        mt-1.5
                        text-xs
                        text-gray-500
                    ">
                        This shipment cannot be moved to another status.
                    </p>

                )}

            </div>


            {/* =========================
                Carrier
            ========================= */}

            <div>

                <label
                    htmlFor="shipment-carrier"
                    className="
                        mb-1.5
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    "
                >
                    Carrier
                </label>


                <input
                    id="shipment-carrier"
                    type="text"
                    name="carrier"
                    value={
                        formData.carrier
                    }
                    onChange={
                        handleChange
                    }
                    disabled={loading}
                    placeholder="e.g. Delhivery"
                    maxLength={100}
                    className="
                        admin-input
                    "
                />

            </div>


            {/* =========================
                Tracking Number
            ========================= */}

            <div>

                <label
                    htmlFor="shipment-tracking-number"
                    className="
                        mb-1.5
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    "
                >
                    Tracking Number
                </label>


                <input
                    id="shipment-tracking-number"
                    type="text"
                    name="trackingNumber"
                    value={
                        formData.trackingNumber
                    }
                    onChange={
                        handleChange
                    }
                    disabled={loading}
                    placeholder="Enter tracking number"
                    maxLength={100}
                    className="
                        admin-input
                    "
                />

            </div>


            {/* =========================
                Actions
            ========================= */}

            <div className="
                flex
                justify-end
                gap-3
                border-t
                border-gray-200
                pt-4
            ">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="
                        admin-button-secondary
                    "
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={loading}
                    className="
                        admin-button-primary
                    "
                >
                    {loading
                        ? "Updating..."
                        : "Update Shipment"}
                </button>

            </div>

        </form>

    );

};


export default AdminShipmentForm;