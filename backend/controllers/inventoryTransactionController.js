const {
    getAllInventoryTransactions
} = require(
    "../services/inventoryTransactionService"
);


const getAll = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await getAllInventoryTransactions({

                page:
                    Number(
                        req.query.page
                    ) || 1,

                limit:
                    Number(
                        req.query.limit
                    ) || 20,

                search:
                    req.query.search || "",

                performedBy:
                    req.query.performedBy || "",

                productId:
                    req.query.productId || "",

                type:
                    req.query.type || "",

                source:
                    req.query.source || "ADMIN",

                sort:
                    req.query.sort || "NEWEST"

            });


        return res.status(200).json({

            success: true,

            data:
                result.transactions,

            pagination:
                result.pagination,

            stats:
                result.stats

        });

    }
    catch (error) {

        next(error);

    }

};


module.exports = {
    getAll
};