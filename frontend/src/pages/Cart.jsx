import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Check,
    Minus,
    Plus,
    ShoppingCart,
    Trash2
} from "lucide-react";

import {
    getCustomerCart,
    updateCustomerCartItem,
    toggleCustomerCartItem,
    removeCustomerCartItem,
    clearCustomerCart
} from "../services/customer/cartService";


const Cart = () => {

    const navigate = useNavigate();


    const [cart, setCart] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionError, setActionError] = useState("");

    const [actionLoading, setActionLoading] = useState({});


    /*
     * =========================================================
     * FETCH CART
     * =========================================================
     */

    const fetchCart = async () => {

        try {

            setError("");

            const response =
                await getCustomerCart();

            /*
             * Backend response:
             *
             * {
             *     success: true,
             *     data: cart
             * }
             */

            setCart(
                response?.data || {
                    items: []
                }
            );

        }
        catch (err) {

            console.error(
                "Failed to load cart:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load cart"
            );

        }
        finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchCart();

    }, []);


    /*
     * =========================================================
     * HELPERS
     * =========================================================
     */

    const items = cart?.items || [];


    const setItemLoading = (
        productVariantId,
        value
    ) => {

        setActionLoading(current => ({
            ...current,
            [productVariantId]: value
        }));

    };


    const isItemLoading = (
        productVariantId
    ) => {

        return Boolean(
            actionLoading[productVariantId]
        );

    };


    const getProductName = (item) => {

        return (
            item?.productVariant?.productId?.name ||
            item?.productVariant?.productId?.productName ||
            "Product"
        );

    };


    const getVariantImage = (item) => {

        const images =
            item?.productVariant?.images || [];

        return images[0]?.url || null;

    };


    const getSellingPrice = (item) => {

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


    const getOriginalPrice = (item) => {

        return Number(
            item?.productVariant?.price || 0
        );

    };


    const getAttributes = (item) => {

        const attributes =
            item?.productVariant?.attributes;

        if (!attributes) {
            return [];
        }

        if (Array.isArray(attributes)) {

            return attributes
                .map(attribute => {

                    if (!attribute) {
                        return null;
                    }

                    if (
                        typeof attribute ===
                        "string"
                    ) {

                        return attribute;

                    }

                    const name =
                        attribute.name ||
                        attribute.key ||
                        attribute.attribute;

                    const value =
                        attribute.value;

                    if (name && value) {

                        return `${name}: ${value}`;

                    }

                    return value || name || null;

                })
                .filter(Boolean);

        }

        if (
            typeof attributes ===
            "object"
        ) {

            return Object.entries(
                attributes
            ).map(
                ([key, value]) =>
                    `${key}: ${value}`
            );

        }

        return [];

    };


    /*
     * =========================================================
     * SELECTED ITEMS
     * =========================================================
     */

    const selectedItems = useMemo(() => {

        return items.filter(
            item => item.selected
        );

    }, [items]);


    const allSelected =
        items.length > 0 &&
        selectedItems.length === items.length;


    const selectedCount =
        selectedItems.length;


    /*
     * =========================================================
     * PRICE CALCULATIONS
     * =========================================================
     */

    const subtotal = useMemo(() => {

        return selectedItems.reduce(
            (total, item) => {

                const price =
                    getSellingPrice(item);

                const quantity =
                    Number(item.quantity || 0);

                return total +
                    price * quantity;

            },
            0
        );

    }, [selectedItems]);


    const originalTotal = useMemo(() => {

        return selectedItems.reduce(
            (total, item) => {

                const price =
                    getOriginalPrice(item);

                const quantity =
                    Number(item.quantity || 0);

                return total +
                    price * quantity;

            },
            0
        );

    }, [selectedItems]);


    const discount =
        Math.max(
            originalTotal - subtotal,
            0
        );


    const formatPrice = (amount) => {

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
     * =========================================================
     * SELECT / UNSELECT ITEM
     * =========================================================
     */

    const handleToggleSelection = async (
        item
    ) => {

        const variantId =
            item?.productVariant?._id;

        if (!variantId) {
            return;
        }

        try {

            setActionError("");

            setItemLoading(
                variantId,
                true
            );

            await toggleCustomerCartItem({
                productVariantId: variantId,
                selected: !item.selected
            });

            /*
             * Fetch again so the backend remains
             * the source of truth.
             */

            await fetchCart();

        }
        catch (err) {

            console.error(
                "Failed to update selection:",
                err
            );

            setActionError(
                err.response?.data?.message ||
                "Failed to update item selection"
            );

        }
        finally {

            setItemLoading(
                variantId,
                false
            );

        }
    };


    /*
     * =========================================================
     * SELECT ALL
     * =========================================================
     */

    const handleSelectAll = async () => {

        if (!items.length) {
            return;
        }

        try {

            setActionError("");

            /*
             * If everything is selected,
             * clicking Select All unselects everything.
             *
             * Otherwise it selects everything.
             */

            const newSelected =
                !allSelected;


            setActionLoading({
                selectAll: true
            });


            /*
             * Update only the items that actually
             * need changing.
             */

            const requests =
                items
                    .filter(
                        item =>
                            Boolean(
                                item.selected
                            ) !== newSelected
                    )
                    .map(item => {

                        const variantId =
                            item?.productVariant?._id;

                        return toggleCustomerCartItem({
                            productVariantId: variantId,
                            selected: newSelected
                        });

                    });


            await Promise.all(
                requests
            );

            await fetchCart();

        }
        catch (err) {

            console.error(
                "Failed to select all:",
                err
            );

            setActionError(
                err.response?.data?.message ||
                "Failed to update cart selection"
            );

        }
        finally {

            setActionLoading({
                selectAll: false
            });

        }
    };


    /*
     * =========================================================
     * QUANTITY
     * =========================================================
     */

    const handleQuantityChange = async (
        item,
        change
    ) => {

        const variantId =
            item?.productVariant?._id;

        if (!variantId) {
            return;
        }

        const currentQuantity =
            Number(item.quantity || 1);

        const newQuantity =
            currentQuantity + change;


        /*
         * Never allow quantity below 1.
         */

        if (newQuantity < 1) {
            return;
        }


        try {

            setActionError("");

            setItemLoading(
                variantId,
                true
            );


            await updateCustomerCartItem({
                productVariantId: variantId,
                quantity: newQuantity
            });


            await fetchCart();

        }
        catch (err) {

            console.error(
                "Failed to update quantity:",
                err
            );

            setActionError(
                err.response?.data?.message ||
                "Failed to update quantity"
            );

        }
        finally {

            setItemLoading(
                variantId,
                false
            );

        }
    };


    /*
     * =========================================================
     * REMOVE
     * =========================================================
     */

    const handleRemove = async (
        item
    ) => {

        const variantId =
            item?.productVariant?._id;

        if (!variantId) {
            return;
        }

        try {

            setActionError("");

            setItemLoading(
                variantId,
                true
            );


            await removeCustomerCartItem(
                variantId
            );


            await fetchCart();

        }
        catch (err) {

            console.error(
                "Failed to remove item:",
                err
            );

            setActionError(
                err.response?.data?.message ||
                "Failed to remove item"
            );

        }
        finally {

            setItemLoading(
                variantId,
                false
            );

        }
    };


    /*
     * =========================================================
     * CLEAR CART
     * =========================================================
     */

    const handleClearCart = async () => {

        if (!items.length) {
            return;
        }


        try {

            setActionError("");

            setActionLoading({
                clearCart: true
            });


            await clearCustomerCart();

            await fetchCart();

        }
        catch (err) {

            console.error(
                "Failed to clear cart:",
                err
            );

            setActionError(
                err.response?.data?.message ||
                "Failed to clear cart"
            );

        }
        finally {

            setActionLoading({
                clearCart: false
            });

        }
    };



    const handleBuy = async () => {
        

        if (!selectedCount) {

            await handleSelectAll();

            return;

        }


        navigate(
            "/order?type=cart"
        );

    };


    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading) {

        return (
            <main className="
                min-h-[500px]
                bg-gray-50
                px-4
                py-8
            ">

                <div className="
                    mx-auto
                    max-w-7xl
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-10
                    text-center
                    text-gray-500
                ">
                    Loading cart...
                </div>

            </main>
        );

    }


    /*
     * =========================================================
     * INITIAL LOAD ERROR
     * =========================================================
     */

    if (error) {

        return (
            <main className="
                min-h-[500px]
                bg-gray-50
                px-4
                py-8
            ">

                <div className="
                    mx-auto
                    max-w-7xl
                    rounded-xl
                    border
                    border-red-200
                    bg-white
                    p-10
                    text-center
                    text-red-600
                ">

                    {error}

                </div>

            </main>
        );

    }


    /*
     * =========================================================
     * EMPTY CART
     * =========================================================
     */

    if (!items.length) {

        return (
            <main className="
                min-h-[500px]
                bg-gray-50
                px-4
                py-8
            ">

                <div className="
                    mx-auto
                    max-w-7xl
                ">

                    <div className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-12
                        text-center
                    ">

                        <ShoppingCart
                            size={52}
                            className="
                                mx-auto
                                text-gray-300
                            "
                        />

                        <h1 className="
                            mt-5
                            text-2xl
                            font-semibold
                            text-gray-800
                        ">
                            Your cart is empty
                        </h1>

                        <p className="
                            mt-2
                            text-gray-500
                        ">
                            Add something to your cart
                            and it will appear here.
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
                                px-6
                                py-3
                                font-medium
                                text-white
                                transition
                                hover:bg-orange-600
                            "
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </main>
        );

    }


    /*
     * =========================================================
     * MAIN CART
     * =========================================================
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
                max-w-7xl
            ">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    mb-5
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                ">

                    <div className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

                        <div>

                            <h1 className="
                                text-2xl
                                font-semibold
                                text-gray-900
                            ">
                                Shopping Cart
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-gray-500
                            ">
                                {items.length}{" "}
                                {items.length === 1
                                    ? "item"
                                    : "items"}
                            </p>

                        </div>


                        <div className="
                            flex
                            items-center
                            gap-4
                        ">

                            <button
                                type="button"
                                onClick={
                                    handleSelectAll
                                }
                                disabled={
                                    actionLoading.selectAll
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    hover:text-orange-500
                                    disabled:opacity-50
                                "
                            >

                                <span className="
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center
                                    rounded
                                    border
                                    border-gray-400
                                ">

                                    {allSelected && (
                                        <Check
                                            size={15}
                                            strokeWidth={3}
                                        />
                                    )}

                                </span>

                                Select All

                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleClearCart
                                }
                                disabled={
                                    actionLoading.clearCart
                                }
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    text-sm
                                    text-red-500
                                    hover:text-red-600
                                    disabled:opacity-50
                                "
                            >

                                <Trash2
                                    size={16}
                                />

                                Clear Cart

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACTION ERROR
                ================================================= */}

                {actionError && (

                    <div className="
                        mb-5
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-600
                    ">

                        {actionError}

                    </div>

                )}


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    lg:grid-cols-[minmax(0,1fr)_340px]
                ">


                    {/* =================================================
                        CART ITEMS
                    ================================================= */}

                    <div className="
                        space-y-4
                    ">

                        {items.map(
                            (item) => {

                                const variant =
                                    item.productVariant;

                                const variantId =
                                    variant?._id;

                                const productName =
                                    getProductName(
                                        item
                                    );

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

                                const attributes =
                                    getAttributes(
                                        item
                                    );

                                const isSelected =
                                    Boolean(
                                        item.selected
                                    );

                                const busy =
                                    isItemLoading(
                                        variantId
                                    );


                                return (
                                    <div
                                        key={
                                            item._id ||
                                            variantId
                                        }
                                        className={`
                                            rounded-xl
                                            border
                                            bg-white
                                            p-4
                                            shadow-sm
                                            transition
                                            ${
                                                isSelected
                                                    ? "border-orange-200"
                                                    : "border-gray-200"
                                            }
                                        `}
                                    >

                                        <div className="
                                            flex
                                            gap-4
                                        ">


                                            {/* =====================================
                                                SELECTION
                                            ===================================== */}

                                            <div className="
                                                flex
                                                shrink-0
                                                items-start
                                                pt-2
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleSelection(
                                                            item
                                                        )
                                                    }
                                                    disabled={
                                                        busy
                                                    }
                                                    aria-label={
                                                        isSelected
                                                            ? "Unselect item"
                                                            : "Select item"
                                                    }
                                                    className={`
                                                        flex
                                                        h-5
                                                        w-5
                                                        items-center
                                                        justify-center
                                                        rounded
                                                        border
                                                        transition
                                                        ${
                                                            isSelected
                                                                ? "border-orange-500 bg-orange-500 text-white"
                                                                : "border-gray-400 bg-white"
                                                        }
                                                        ${
                                                            busy
                                                                ? "cursor-wait opacity-50"
                                                                : ""
                                                        }
                                                    `}
                                                >

                                                    {isSelected && (
                                                        <Check
                                                            size={14}
                                                            strokeWidth={3}
                                                        />
                                                    )}

                                                </button>

                                            </div>


                                            {/* =====================================
                                                IMAGE
                                            ===================================== */}

                                            <div className="
                                                flex
                                                h-32
                                                w-32
                                                shrink-0
                                                items-center
                                                justify-center
                                                overflow-hidden
                                                rounded-lg
                                                border
                                                border-gray-100
                                                bg-white
                                            ">

                                                {image ? (

                                                    <img
                                                        src={image}
                                                        alt={
                                                            productName
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
                                                        No image
                                                    </span>

                                                )}

                                            </div>


                                            {/* =====================================
                                                DETAILS
                                            ===================================== */}

                                            <div className="
                                                flex
                                                min-w-0
                                                flex-1
                                                flex-col
                                            ">


                                                {/* PRODUCT NAME */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/product-variants/${variantId}`
                                                        )
                                                    }
                                                    className="
                                                        w-fit
                                                        cursor-pointer
                                                        text-left
                                                        text-base
                                                        font-semibold
                                                        text-gray-900
                                                        transition
                                                        hover:text-blue-600
                                                        hover:underline
                                                    "
                                                >

                                                    {productName}

                                                </button>


                                                {/* SKU */}

                                                {variant?.sku && (

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-gray-400
                                                    ">
                                                        SKU:{" "}
                                                        {variant.sku}
                                                    </p>

                                                )}


                                                {/* ATTRIBUTES */}

                                                {attributes.length >
                                                    0 && (

                                                    <div className="
                                                        mt-2
                                                        flex
                                                        flex-wrap
                                                        gap-x-4
                                                        gap-y-1
                                                    ">

                                                        {attributes.map(
                                                            (
                                                                attribute,
                                                                index
                                                            ) => (

                                                                <span
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="
                                                                        text-sm
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


                                                {/* PRICE */}

                                                <div className="
                                                    mt-3
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                ">

                                                    <span className="
                                                        text-lg
                                                        font-semibold
                                                        text-gray-900
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

                                                </div>


                                                {/* BOTTOM CONTROLS */}

                                                <div className="
                                                    mt-auto
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-4
                                                    pt-4
                                                ">


                                                    {/* QUANTITY */}

                                                    <div className="
                                                        flex
                                                        items-center
                                                        overflow-hidden
                                                        rounded-lg
                                                        border
                                                        border-gray-300
                                                    ">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item,
                                                                    -1
                                                                )
                                                            }
                                                            disabled={
                                                                busy ||
                                                                item.quantity <= 1
                                                            }
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                text-gray-700
                                                                hover:bg-gray-100
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-40
                                                            "
                                                        >
                                                            <Minus
                                                                size={16}
                                                            />
                                                        </button>


                                                        <span className="
                                                            flex
                                                            h-9
                                                            min-w-10
                                                            items-center
                                                            justify-center
                                                            border-x
                                                            border-gray-300
                                                            px-2
                                                            text-sm
                                                            font-medium
                                                        ">
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item,
                                                                    1
                                                                )
                                                            }
                                                            disabled={
                                                                busy
                                                            }
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                text-gray-700
                                                                hover:bg-gray-100
                                                                disabled:cursor-wait
                                                                disabled:opacity-40
                                                            "
                                                        >
                                                            <Plus
                                                                size={16}
                                                            />
                                                        </button>

                                                    </div>


                                                    {/* REMOVE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemove(
                                                                item
                                                            )
                                                        }
                                                        disabled={
                                                            busy
                                                        }
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                            text-sm
                                                            font-medium
                                                            text-red-500
                                                            hover:text-red-600
                                                            disabled:opacity-40
                                                        "
                                                    >

                                                        <Trash2
                                                            size={16}
                                                        />

                                                        Remove

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                );

                            }
                        )}

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <aside className="
                        h-fit
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                        lg:sticky
                        lg:top-5
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-gray-900
                        ">
                            Cart Summary
                        </h2>


                        <div className="
                            mt-5
                            space-y-4
                        ">

                            <div className="
                                flex
                                justify-between
                                text-sm
                                text-gray-600
                            ">

                                <span>
                                    Selected items
                                </span>

                                <span>
                                    {selectedCount}
                                </span>

                            </div>


                            <div className="
                                flex
                                justify-between
                                text-sm
                                text-gray-600
                            ">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    {
                                        formatPrice(
                                            originalTotal
                                        )
                                    }
                                </span>

                            </div>


                            {discount > 0 && (

                                <div className="
                                    flex
                                    justify-between
                                    text-sm
                                    text-green-600
                                ">

                                    <span>
                                        Discount
                                    </span>

                                    <span>
                                        -{" "}
                                        {
                                            formatPrice(
                                                discount
                                            )
                                        }
                                    </span>

                                </div>

                            )}


                            <div className="
                                border-t
                                border-gray-200
                                pt-4
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <span className="
                                        text-base
                                        font-semibold
                                        text-gray-900
                                    ">
                                        Total
                                    </span>

                                    <span className="
                                        text-xl
                                        font-bold
                                        text-gray-900
                                    ">
                                        {
                                            formatPrice(
                                                subtotal
                                            )
                                        }
                                    </span>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={handleBuy}
                                disabled={
                                    actionLoading.selectAll
                                }
                                className="
                                    mt-2
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-orange-500
                                    px-5
                                    py-3
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-orange-600
                                    disabled:cursor-wait
                                    disabled:opacity-60
                                "
                            >

                                {selectedCount === 0
                                    ? "Buy All"
                                    : "Buy Now"}

                            </button>

                        </div>

                    </aside>

                </div>

            </div>

        </main>
    );
};


export default Cart;