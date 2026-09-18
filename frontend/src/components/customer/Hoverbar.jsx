import {
    useEffect,
    useState
} from "react";

import {
    getCustomerCategories
} from "../../services/customer/categoryService";

import {
    getCustomerProducts
} from "../../services/customer/productService";

import HoverListing from "./HoverListing";


const Hoverbar = () => {

    const [
        categories,
        setCategories
    ] = useState([]);

    const [
        activeHeading,
        setActiveHeading
    ] = useState(null);

    const [
        categoryProducts,
        setCategoryProducts
    ] = useState({});

    const [
        loading,
        setLoading
    ] = useState(false);


    useEffect(() => {

        const fetchCategories = async () => {

            try {

                const result =
                    await getCustomerCategories();

                setCategories(
                    result.data || []
                );

            }
            catch (error) {

                console.error(
                    "Unable to load customer categories:",
                    error
                );

            }

        };


        fetchCategories();

    }, []);


    

    const groupedCategories =
        categories.reduce(
            (groups, category) => {

                const heading =
                    category.heading;

                if (!heading) {
                    return groups;
                }

                if (!groups[heading]) {
                    groups[heading] = [];
                }

                groups[heading].push(
                    category
                );

                return groups;

            },
            {}
        );


    const headings =
        Object.keys(groupedCategories);


    const handleHeadingEnter =
        async (heading) => {

            setActiveHeading(heading);

            const headingCategories =
                groupedCategories[heading] || [];



            const uncachedCategories =
                headingCategories.filter(
                    category =>
                        !categoryProducts[
                            category._id
                        ]
                );


            if (
                uncachedCategories.length === 0
            ) {
                return;
            }


            try {

                setLoading(true);


                const results =
                    await Promise.all(
                        uncachedCategories.map(
                            async (category) => {

                                const result =
                                    await getCustomerProducts({
                                        categoryId:
                                            category._id,


                                        page: 1,

                                        limit: 10
                                    });


                                return {
                                    categoryId:
                                        category._id,

                                    products:
                                        result.data || []
                                };

                            }
                        )
                    );


                setCategoryProducts(
                    current => {

                        const updated = {
                            ...current
                        };


                        results.forEach(
                            ({
                                categoryId,
                                products
                            }) => {

                                updated[
                                    categoryId
                                ] = products;

                            }
                        );


                        return updated;

                    }
                );

            }
            catch (error) {

                console.error(
                    "Unable to load hover products:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };


    const handleMouseLeave =
        () => {

            setActiveHeading(null);

        };


    const activeCategories =
        activeHeading
            ? groupedCategories[
                activeHeading
            ] || []
            : [];


    return (
        <div
            className="
                relative
                z-40
                hidden
                lg:block
                border-b
                border-gray-200
                bg-white
                shadow-sm
            "
            onMouseLeave={
                handleMouseLeave
            }
        >

            {/* =========================
                MAIN HEADINGS
            ========================= */}

            <div
                className="
                    mx-auto
                    flex
                    max-w-[1400px]
                    items-center
                    justify-between
                    px-6
                "
            >

                {headings.map(
                    (heading) => (

                        <div
                            key={heading}
                            onMouseEnter={() =>
                                handleHeadingEnter(
                                    heading
                                )
                            }
                            className="
                                cursor-pointer
                                whitespace-nowrap
                                px-4
                                py-4
                                text-sm
                                font-medium
                                text-gray-800
                                transition
                                hover:text-orange-500
                            "
                        >
                            {heading}
                        </div>

                    )
                )}

            </div>


            {/* =========================
                HOVER MEGA MENU
            ========================= */}

            {activeHeading && (

                <div
                    className="
                        absolute
                        left-1/2
                        top-full
                        w-[calc(100%-80px)]
                        max-w-[1400px]
                        -translate-x-1/2
                        bg-white
                        shadow-xl
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-5
                            gap-8
                            px-8
                            py-7
                        "
                    >

                        {activeCategories.map(
                            (category) => {

                                const products =
                                    categoryProducts[
                                        category._id
                                    ] || [];


                                return (
                                    <div
                                        key={
                                            category._id
                                        }
                                        className="
                                            min-w-0
                                        "
                                    >

                                        {/* Category */}

                                        <h3
                                            className="
                                                mb-3
                                                text-sm
                                                font-semibold
                                                text-orange-500
                                            "
                                        >
                                            {
                                                category.name
                                            }
                                        </h3>


                                        {/* Products */}

                                        <div
                                            className="
                                                space-y-2
                                            "
                                        >

                                            {products
                                                .slice(0, 8)
                                                .map(
                                                    product => (

                                                        <button
                                                            key={
                                                                product._id
                                                            }
                                                            type="button"
                                                            className="
                                                                block
                                                                w-full
                                                                truncate
                                                                text-left
                                                                text-sm
                                                                text-gray-600
                                                                hover:text-orange-500
                                                            "
                                                        >
                                                            {
                                                                product.name
                                                            }
                                                        </button>

                                                    )
                                                )}

                                        </div>

                                    </div>
                                );

                            }
                        )}


                        {/* =========================
                            FUTURE EXTRA COLUMN
                        ========================= */}

                        <div
                            className="
                                min-w-0
                            "
                        >

                            <h3
                                className="
                                    mb-3
                                    text-sm
                                    font-semibold
                                    text-orange-500
                                "
                            >
                                Brands
                            </h3>

                            <div
                                className="
                                    space-y-2
                                "
                            >

                                {/* We'll populate this
                                    dynamically next */}

                                <span
                                    className="
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Coming soon
                                </span>

                            </div>

                        </div>

                    </div>


                    {loading && (
                        <div
                            className="
                                absolute
                                right-5
                                top-3
                                text-xs
                                text-gray-400
                            "
                        >
                            Loading...
                        </div>
                    )}

                </div>

            )}

        </div>
    );
};


export default Hoverbar;