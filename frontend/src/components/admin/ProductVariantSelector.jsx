import { useEffect, useState } from "react";

import {
    getAdminCategories
} from "../../services/admin/adminCategoryService";

import {
    getAdminProducts
} from "../../services/admin/adminProductService";

import {
    getProductVariants
} from "../../services/admin/adminProductVariant";


const ProductVariantSelector = ({
    value,
    onChange,
    disabled = false
}) => {

    const [categories, setCategories] = useState([]);

    const [categoryId, setCategoryId] = useState("");

    const [search, setSearch] = useState("");

    const [products, setProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [variants, setVariants] = useState([]);

    const [loadingCategories, setLoadingCategories] =
        useState(false);

    const [loadingProducts, setLoadingProducts] =
        useState(false);

    const [loadingVariants, setLoadingVariants] =
        useState(false);

    const [error, setError] = useState("");


    // =========================
    // Load Categories
    // =========================

    useEffect(() => {

        const loadCategories = async () => {

            try {

                setLoadingCategories(true);
                setError("");

                const response =
                    await getAdminCategories({
                        page: 1,
                        limit: 100,
                        status: "ACTIVE",
                        sort: "NAME_ASC"
                    });

                setCategories(
                    response.data.categories || []
                );

            }
            catch (err) {

                setError(
                    err.response?.data.categories.message ||
                    "Unable to load categories."
                );

            }
            finally {

                setLoadingCategories(false);

            }

        };


        loadCategories();

    }, []);


    // =========================
    // Search Products
    // =========================

    useEffect(() => {

        if (!categoryId || !search.trim()) {

            setProducts([]);

            return;
        }


        const timer = setTimeout(
            async () => {

                try {

                    setLoadingProducts(true);
                    setError("");

                    const response =
                        await getAdminProducts({

                            page: 1,

                            limit: 10,

                            search: search.trim(),

                            status: "ACTIVE",

                            sort: "NAME_ASC",

                            categoryId

                        });


                    setProducts(
                        response.data || []
                    );

                }
                catch (err) {

                    setError(
                        err.response?.data?.data?.message ||
                        "Unable to search products."
                    );

                    setProducts([]);

                }
                finally {

                    setLoadingProducts(false);

                }

            },
            300
        );


        return () => clearTimeout(timer);

    }, [categoryId, search]);


    // =========================
    // Select Product
    // =========================

    const handleProductSelect = async (
        product
    ) => {

        try {

            setSelectedProduct(product);

            setSearch(product.name);

            setProducts([]);

            setLoadingVariants(true);
            setError("");

            const response =
                await getProductVariants(
                    product._id
                );

            setVariants(
                response.data || []
            );

        }
        catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to load product variants."
            );

            setVariants([]);

        }
        finally {

            setLoadingVariants(false);

        }

    };


    // =========================
    // Select Variant
    // =========================

    const handleVariantSelect = (
        variant
    ) => {

        onChange(
            variant._id
        );

    };


    // =========================
    // Category Change
    // =========================

    const handleCategoryChange = (
        event
    ) => {

        const newCategoryId =
            event.target.value;

        setCategoryId(newCategoryId);

        setSearch("");

        setProducts([]);

        setSelectedProduct(null);

        setVariants([]);

        onChange("");

    };


    return (

        <div className="space-y-4">

            {/* Category */}

            <div>

                <label
                    htmlFor="variant-category"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    "
                >
                    Category
                </label>


                <select
                    id="variant-category"
                    value={categoryId}
                    onChange={handleCategoryChange}
                    disabled={
                        disabled ||
                        loadingCategories
                    }
                    className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        px-4
                        text-sm
                        text-gray-900
                        outline-none
                        focus:border-gray-900
                        focus:ring-2
                        focus:ring-gray-100
                        disabled:cursor-not-allowed
                        disabled:bg-gray-100
                    "
                >

                    <option value="">
                        Select category
                    </option>

                    {categories.map(category => (

                        <option
                            key={category._id}
                            value={category._id}
                        >
                            {category.name}
                        </option>

                    ))}

                </select>

            </div>


            {/* Product Search */}

            <div>

                <label
                    htmlFor="variant-product-search"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    "
                >
                    Product
                </label>


                <input
                    id="variant-product-search"
                    type="text"
                    value={search}
                    onChange={event =>
                        setSearch(
                            event.target.value
                        )
                    }
                    placeholder={
                        categoryId
                            ? "Search product..."
                            : "Select a category first"
                    }
                    disabled={
                        disabled ||
                        !categoryId
                    }
                    className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        px-4
                        text-sm
                        text-gray-900
                        outline-none
                        focus:border-gray-900
                        focus:ring-2
                        focus:ring-gray-100
                        disabled:cursor-not-allowed
                        disabled:bg-gray-100
                    "
                />


                {/* Product results */}

                {products.length > 0 && (

                    <div className="
                        mt-2
                        max-h-60
                        overflow-y-auto
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        shadow-sm
                    ">

                        {products.map(product => (

                            <button
                                type="button"
                                key={product._id}
                                onClick={() =>
                                    handleProductSelect(
                                        product
                                    )
                                }
                                className="
                                    w-full
                                    border-b
                                    border-gray-100
                                    px-4
                                    py-3
                                    text-left
                                    transition
                                    last:border-b-0
                                    hover:bg-gray-50
                                "
                            >

                                <p className="
                                    text-sm
                                    font-medium
                                    text-gray-900
                                ">
                                    {product.name}
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                ">
                                    {product.brand}
                                </p>

                            </button>

                        ))}

                    </div>

                )}


                {loadingProducts && (

                    <p className="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        Searching products...
                    </p>

                )}

            </div>


            {/* Variants */}

            {selectedProduct && (

                <div>

                    <div className="
                        mb-2
                        flex
                        items-center
                        justify-between
                    ">

                        <label className="
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            Product Variant
                        </label>

                        <span className="
                            text-xs
                            text-gray-500
                        ">
                            {selectedProduct.name}
                        </span>

                    </div>


                    {loadingVariants && (

                        <p className="
                            text-sm
                            text-gray-500
                        ">
                            Loading variants...
                        </p>

                    )}


                    {!loadingVariants &&
                        variants.length === 0 && (

                            <p className="
                                rounded-xl
                                bg-gray-50
                                px-4
                                py-3
                                text-sm
                                text-gray-500
                            ">
                                No active variants found.
                            </p>

                        )}


                    <div className="space-y-2">

                        {variants.map(variant => {

                            const isSelected =
                                value === variant._id;


                            return (

                                <button
                                    type="button"
                                    key={variant._id}
                                    onClick={() =>
                                        handleVariantSelect(
                                            variant
                                        )
                                    }
                                    disabled={disabled}
                                    className={`
                                        w-full
                                        rounded-xl
                                        border
                                        px-4
                                        py-3
                                        text-left
                                        transition
                                        ${
                                            isSelected
                                                ? "border-gray-900 bg-gray-50"
                                                : "border-gray-200 hover:border-gray-400"
                                        }
                                    `}
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    ">

                                        <div>

                                            <p className="
                                                text-sm
                                                font-medium
                                                text-gray-900
                                            ">
                                                {variant.primarySpecification?.name}
                                                {": "}
                                                {variant.primarySpecification?.value}
                                            </p>

                                            {variant.secondarySpecification && (

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-gray-500
                                                ">
                                                    {variant.secondarySpecification.name}
                                                    {": "}
                                                    {variant.secondarySpecification.value}
                                                </p>

                                            )}

                                            {variant.color && (

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-gray-500
                                                ">
                                                    Color: {variant.color}
                                                </p>

                                            )}

                                        </div>


                                        <div className="
                                            shrink-0
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                        ">
                                            ₹{variant.price?.toLocaleString("en-IN")}
                                        </div>

                                    </div>

                                </button>

                            );

                        })}

                    </div>

                </div>

            )}


            {error && (

                <p className="
                    rounded-xl
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                ">
                    {error}
                </p>

            )}

        </div>

    );

};


export default ProductVariantSelector;