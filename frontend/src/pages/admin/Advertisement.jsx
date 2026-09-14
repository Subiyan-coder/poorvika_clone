import { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    Image as ImageIcon
} from "lucide-react";

import toast from "react-hot-toast";

import AdvertisementForm from "../../components/admin/AdvertisementForm";

import {
    getAllAdvertisements,
    deleteAdvertisement
} from "../../services/advertisementService";


const Advertisement = () => {

    const [advertisements, setAdvertisements] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingAdvertisement, setEditingAdvertisement] =
        useState(null);

    const [deletingId, setDeletingId] = useState(null);


    // =========================
    // Load Advertisements
    // =========================

    const loadAdvertisements = async () => {

        try {

            setLoading(true);

            const response =
                await getAllAdvertisements();

            setAdvertisements(
                response.data?.advertisements || []
            );

        }
        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to load advertisements"
            );

        }
        finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadAdvertisements();

    }, []);


    // =========================
    // Create
    // =========================

    const handleCreate = () => {

        setEditingAdvertisement(null);

        setShowForm(true);

    };


    // =========================
    // Edit
    // =========================

    const handleEdit = (advertisement) => {

        setEditingAdvertisement(advertisement);

        setShowForm(true);

    };


    // =========================
    // Form Success
    // =========================

    const handleFormSuccess = () => {

        setShowForm(false);

        setEditingAdvertisement(null);

        loadAdvertisements();

    };


    // =========================
    // Delete
    // =========================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this advertisement?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(id);

            await deleteAdvertisement(id);

            toast.success(
                "Advertisement deleted successfully"
            );

            setAdvertisements((current) =>
                current.filter(
                    (advertisement) =>
                        advertisement._id !== id
                )
            );

        }
        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to delete advertisement"
            );

        }
        finally {

            setDeletingId(null);

        }
    };


    // =========================
    // Close Form
    // =========================

    const handleCloseForm = () => {

        setShowForm(false);

        setEditingAdvertisement(null);

    };


    return (

        <div className="space-y-6">

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

                    <h1 className="
                        text-2xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                    ">
                        Advertisements
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">
                        Manage promotional advertisements
                        displayed across Poorvika.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleCreate}
                    className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gray-900
                        px-4
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-gray-800
                        active:scale-[0.98]
                    "
                >

                    <Plus size={17} />

                    Add Advertisement

                </button>

            </div>


            {/* =========================
                Advertisement Form
            ========================= */}

            {showForm && (

                <AdvertisementForm
                    advertisement={editingAdvertisement}
                    onSuccess={handleFormSuccess}
                    onCancel={handleCloseForm}
                />

            )}


            {/* =========================
                Content
            ========================= */}

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
            ">

                {loading ? (

                    <div className="
                        flex
                        min-h-48
                        items-center
                        justify-center
                        text-sm
                        text-gray-500
                    ">
                        Loading advertisements...
                    </div>

                ) : advertisements.length === 0 ? (

                    <div className="
                        flex
                        min-h-72
                        flex-col
                        items-center
                        justify-center
                        px-6
                        text-center
                    ">

                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-gray-100
                        ">

                            <ImageIcon
                                size={22}
                                className="text-gray-500"
                            />

                        </div>


                        <h2 className="
                            mt-4
                            text-sm
                            font-semibold
                            text-gray-900
                        ">
                            No advertisements yet
                        </h2>


                        <p className="
                            mt-1
                            max-w-sm
                            text-sm
                            text-gray-500
                        ">
                            Create your first advertisement
                            to start promoting products or
                            offers.
                        </p>


                        <button
                            type="button"
                            onClick={handleCreate}
                            className="
                                mt-5
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-gray-900
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                hover:bg-gray-800
                            "
                        >

                            <Plus size={16} />

                            Add Advertisement

                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="
                            min-w-full
                            divide-y
                            divide-gray-200
                        ">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="
                                        px-6
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Advertisement
                                    </th>

                                    <th className="
                                        px-6
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Placement
                                    </th>

                                    <th className="
                                        px-6
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Status
                                    </th>

                                    <th className="
                                        px-6
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Priority
                                    </th>

                                    <th className="
                                        px-6
                                        py-3
                                        text-right
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="
                                divide-y
                                divide-gray-100
                            ">

                                {advertisements.map(
                                    (advertisement) => (

                                        <tr
                                            key={
                                                advertisement._id
                                            }
                                            className="
                                                transition
                                                hover:bg-gray-50
                                            "
                                        >

                                            {/* Advertisement */}

                                            <td className="
                                                whitespace-nowrap
                                                px-6
                                                py-4
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-4
                                                ">

                                                    <div className="
                                                        h-16
                                                        w-24
                                                        shrink-0
                                                        overflow-hidden
                                                        rounded-lg
                                                        border
                                                        border-gray-200
                                                        bg-gray-100
                                                    ">

                                                        {advertisement
                                                            .image
                                                            ?.url ? (

                                                            <img
                                                                src={
                                                                    advertisement
                                                                        .image
                                                                        .url
                                                                }
                                                                alt={
                                                                    advertisement
                                                                        .title
                                                                }
                                                                className="
                                                                    h-full
                                                                    w-full
                                                                    object-cover
                                                                "
                                                            />

                                                        ) : (

                                                            <div className="
                                                                flex
                                                                h-full
                                                                w-full
                                                                items-center
                                                                justify-center
                                                            ">

                                                                <ImageIcon
                                                                    size={20}
                                                                    className="
                                                                        text-gray-400
                                                                    "
                                                                />

                                                            </div>

                                                        )}

                                                    </div>


                                                    <div>

                                                        <p className="
                                                            max-w-xs
                                                            truncate
                                                            text-sm
                                                            font-medium
                                                            text-gray-900
                                                        ">
                                                            {
                                                                advertisement
                                                                    .title
                                                            }
                                                        </p>


                                                        {advertisement.link && (

                                                            <a
                                                                href={
                                                                    advertisement
                                                                        .link
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="
                                                                    mt-1
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1
                                                                    text-xs
                                                                    text-gray-500
                                                                    hover:text-gray-900
                                                                "
                                                            >

                                                                View link

                                                                <ExternalLink
                                                                    size={12}
                                                                />

                                                            </a>

                                                        )}

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Placement */}

                                            <td className="
                                                whitespace-nowrap
                                                px-6
                                                py-4
                                                text-sm
                                                text-gray-600
                                            ">

                                                {advertisement.placement}

                                            </td>


                                            {/* Status */}

                                            <td className="
                                                whitespace-nowrap
                                                px-6
                                                py-4
                                            ">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        ${
                                                            advertisement.status ===
                                                            "ACTIVE"
                                                                ? "bg-green-50 text-green-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        advertisement
                                                            .status
                                                    }
                                                </span>

                                            </td>


                                            {/* Priority */}

                                            <td className="
                                                whitespace-nowrap
                                                px-6
                                                py-4
                                                text-sm
                                                text-gray-600
                                            ">

                                                {
                                                    advertisement
                                                        .priority
                                                }

                                            </td>


                                            {/* Actions */}

                                            <td className="
                                                whitespace-nowrap
                                                px-6
                                                py-4
                                                text-right
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-2
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                advertisement
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            text-gray-500
                                                            transition
                                                            hover:bg-gray-100
                                                            hover:text-gray-900
                                                        "
                                                        title="Edit"
                                                    >

                                                        <Pencil
                                                            size={17}
                                                        />

                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                advertisement
                                                                    ._id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            advertisement
                                                                ._id
                                                        }
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            text-gray-500
                                                            transition
                                                            hover:bg-red-50
                                                            hover:text-red-600
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                        "
                                                        title="Delete"
                                                    >

                                                        <Trash2
                                                            size={17}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};


export default Advertisement;