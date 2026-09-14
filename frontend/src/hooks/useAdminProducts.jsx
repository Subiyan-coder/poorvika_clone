import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    getAdminProducts,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
    addProductImages,
    updateProductImage,
    deleteProductImage
} from "../services/admin/adminProductService";


const useAdminProducts = () => {

    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    const [formLoading, setFormLoading] = useState(false);

    const [serverError, setServerError] = useState("");

    const [formError, setFormError] = useState("");


    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("ALL");

    const [sort, setSort] = useState("NEWEST");


    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    });


    const [counts, setCounts] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });


    /*
     * Fetch Products
     */

    const fetchProducts = useCallback(async () => {

        try {

            setLoading(true);
            setServerError("");

            const result = await getAdminProducts({
                page: pagination.page,
                limit: pagination.limit,
                search,
                status,
                sort
            });

            setProducts(result.data);

            setPagination(result.pagination);

            setCounts(result.counts);

        }
        catch (err) {

            setServerError(
                err.response?.data?.message ||
                "Unable to load products."
            );

        }
        finally {

            setLoading(false);

        }

    }, [
        pagination.page,
        pagination.limit,
        search,
        status,
        sort
    ]);


    /*
     * Fetch whenever filters change
     */

    useEffect(() => {

        fetchProducts();

    }, [fetchProducts]);


    /*
     * Search
     */

    const handleSearch = useCallback((value) => {

        setSearch(value);

        setPagination(prev => ({
            ...prev,
            page: 1
        }));

    }, []);


    /*
     * Status Filter
     */

    const handleStatusChange = useCallback((value) => {

        setStatus(value);

        setPagination(prev => ({
            ...prev,
            page: 1
        }));

    }, []);


    /*
     * Sort
     */

    const handleSortChange = useCallback((value) => {

        setSort(value);

        setPagination(prev => ({
            ...prev,
            page: 1
        }));

    }, []);


    /*
     * Page
     */

    const handlePageChange = useCallback((page) => {

        setPagination(prev => ({
            ...prev,
            page
        }));

    }, []);


    /*
     * Create Product
     */

    const handleCreateProduct = useCallback(
        async (data) => {

            try {

                setFormLoading(true);
                setFormError("");

                const result = await createProduct(data);

                await fetchProducts();

                return result;

            }
            catch (err) {

                setFormError(
                    err.response?.data?.message ||
                    "Unable to create product."
                );

                throw err;

            }
            finally {

                setFormLoading(false);

            }

        },
        [fetchProducts]
    );


    /*
     * Update Product
     */

    const handleUpdateProduct = useCallback(
        async (productId, data) => {

            try {

                setFormLoading(true);
                setFormError("");

                const result = await updateProduct(
                    productId,
                    data
                );

                await fetchProducts();

                return result;

            }
            catch (err) {

                setFormError(
                    err.response?.data?.message ||
                    "Unable to update product."
                );

                throw err;

            }
            finally {

                setFormLoading(false);

            }

        },
        [fetchProducts]
    );


    /*
     * Update Status
     */

    const handleUpdateStatus = useCallback(
        async (productId, isActive) => {

            try {

                await updateProductStatus(
                    productId,
                    isActive
                );

                await fetchProducts();

            }
            catch (err) {

                setServerError(
                    err.response?.data?.message ||
                    "Unable to update product status."
                );

            }

        },
        [fetchProducts]
    );


    /*
     * Delete Product
     */

    const handleDeleteProduct = useCallback(
        async (productId) => {

            try {

                await deleteProduct(productId);

                await fetchProducts();

            }
            catch (err) {

                setServerError(
                    err.response?.data?.message ||
                    "Unable to delete product."
                );

            }

        },
        [fetchProducts]
    );


    /*
     * Add Product Images
     */

    const handleAddProductImages = useCallback(
        async (productId, files) => {

            try {

                setFormLoading(true);
                setFormError("");

                const result = await addProductImages(
                    productId,
                    files
                );

                await fetchProducts();

                return result;

            }
            catch (err) {

                setFormError(
                    err.response?.data?.message ||
                    "Unable to upload product images."
                );

                throw err;

            }
            finally {

                setFormLoading(false);

            }

        },
        [fetchProducts]
    );


    /*
     * Update Product Image
     */

    const handleUpdateProductImage = useCallback(
        async (productId, imageId, file) => {

            try {

                setFormLoading(true);
                setFormError("");

                const result = await updateProductImage(
                    productId,
                    imageId,
                    file
                );

                await fetchProducts();

                return result;

            }
            catch (err) {

                setFormError(
                    err.response?.data?.message ||
                    "Unable to update product image."
                );

                throw err;

            }
            finally {

                setFormLoading(false);

            }

        },
        [fetchProducts]
    );


    /*
     * Delete Product Image
     */

    const handleDeleteProductImage = useCallback(
        async (productId, imageId) => {

            try {

                setFormLoading(true);
                setFormError("");

                const result = await deleteProductImage(
                    productId,
                    imageId
                );

                await fetchProducts();

                return result;

            }
            catch (err) {

                setFormError(
                    err.response?.data?.message ||
                    "Unable to delete product image."
                );

                throw err;

            }
            finally {

                setFormLoading(false);

            }

        },
        [fetchProducts]
    );


    return {

        products,

        categories,

        setCategories,

        loading,

        formLoading,

        serverError,

        formError,

        setFormError,

        search,

        status,

        sort,

        pagination,

        counts,

        handleSearch,

        handleStatusChange,

        handleSortChange,

        handlePageChange,

        handleCreateProduct,

        handleUpdateProduct,

        handleUpdateStatus,

        handleDeleteProduct,

        handleAddProductImages,

        handleUpdateProductImage,

        handleDeleteProductImage,

        fetchProducts

    };

};


export default useAdminProducts;