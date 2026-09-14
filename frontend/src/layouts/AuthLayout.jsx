import { Outlet, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useState, useEffect  } from "react";

import {
    getActiveAdvertisements
} from "../services/advertisementService";


const AuthLayout = () => {

    const navigate = useNavigate();

    const [advertisement, setAdvertisement] = useState(null);

    useEffect(() => {

        const loadAdvertisement = async () => {

            try {

                const result =
                    await getActiveAdvertisements("LOGIN");

                const advertisements =
                    result.data?.advertisements || [];

                if (advertisements.length > 0) {
                    setAdvertisement(
                        advertisements[0]
                    );
                }

            }
            catch (error) {

                console.error(
                    "Failed to load advertisement:",
                    error
                );

            }

        };


        loadAdvertisement();

    }, []);

    const handleClose = () => {
        navigate("/");
    };


    const handleOverlayClick = () => {
        handleClose();
    };


    const handleContentClick = (event) => {
        event.stopPropagation();
    };


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-start
                justify-center
                overflow-y-auto
                bg-black/40
                px-4
                py-[5vh]
            "
            onClick={handleOverlayClick}
        >

            <div
                className="
                    relative
                    w-full
                    max-w-4xl
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-2xl
                "
                onClick={handleContentClick}
            >

                {/* Close */}

                <button
                    type="button"
                    onClick={handleClose}
                    className="
                        absolute
                        right-5
                        top-5
                        z-10
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        text-gray-500
                        transition
                        hover:bg-gray-100
                        hover:text-gray-900
                    "
                    aria-label="Close"
                >
                    <X size={20} />
                </button>


                <div className="grid lg:grid-cols-2">

                    {/* Advertisement */}

                    <div className="
                        hidden
                        lg:flex
                        items-center
                        justify-center
                        bg-gray-100
                        p-6
                    ">

                        {advertisement ? (

                            <div className="
                                h-full
                                w-full
                                overflow-hidden
                                rounded-2xl
                            ">

                                {advertisement.link ? (

                                    <a
                                        href={advertisement.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block h-full w-full"
                                    >

                                        <img
                                            src={advertisement.image.url}
                                            alt={
                                                advertisement.title ||
                                                "Poorvika Advertisement"
                                            }
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />

                                    </a>

                                ) : (

                                    <img
                                        src={advertisement.image.url}
                                        alt={
                                            advertisement.title ||
                                            "Poorvika Advertisement"
                                        }
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />

                                )}

                            </div>

                        ) : (

                            <div className="text-center">

                                <p className="
                                    text-sm
                                    font-medium
                                    text-gray-500
                                ">
                                    POORVIKA
                                </p>

                                <h2 className="
                                    mt-2
                                    text-2xl
                                    font-semibold
                                    text-gray-900
                                ">
                                    Great deals.
                                    <br />
                                    Better shopping.
                                </h2>

                                <p className="
                                    mt-3
                                    text-sm
                                    text-gray-500
                                ">
                                    Discover mobiles, tablets and
                                    electronics at great prices.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* Authentication Side */}

                    <div className="
                        flex
                        items-center
                        justify-center
                        px-6
                        py-10
                        sm:px-10
                    ">

                        <div className="w-full max-w-md">

                            <div className="
                                mb-7
                                text-center
                            ">
                                <div className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-gray-900
                                ">
                                    POORVIKA
                                </div>
                            </div>

                            <Outlet />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default AuthLayout;