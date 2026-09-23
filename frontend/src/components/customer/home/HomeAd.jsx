import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";


const HeroAd = ({ ads = [] }) => {

    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {

        if (ads.length <= 1) {
            return;
        }


        const interval = setInterval(() => {

            setCurrentIndex(current => (
                current === ads.length - 1
                    ? 0
                    : current + 1
            ));

        }, 5000);


        return () => clearInterval(interval);

    }, [ads.length]);


    if (!ads.length) {
        return null;
    }


    const currentAd = ads[currentIndex];


    const handlePrevious = () => {

        setCurrentIndex(current => (
            current === 0
                ? ads.length - 1
                : current - 1
        ));

    };


    const handleNext = () => {

        setCurrentIndex(current => (
            current === ads.length - 1
                ? 0
                : current + 1
        ));

    };


    const handleAdClick = () => {

        if (!currentAd.productVariantId) {
            return;
        }

        navigate(
            `/product-variants/${currentAd.productVariantId}`
        );
    };


    return (
        <section className="w-full">

            <div className="relative w-full overflow-hidden">

                <button
                    type="button"
                    onClick={handlePrevious}
                    className="
                        absolute
                        left-3
                        top-1/2
                        z-10
                        -translate-y-1/2
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-white/90
                        shadow-md
                        hover:bg-white
                    "
                    aria-label="Previous advertisement"
                >
                    <ChevronLeft
                        size={22}
                    />
                </button>


                <button
                    type="button"
                    onClick={handleNext}
                    className="
                        absolute
                        right-3
                        top-1/2
                        z-10
                        -translate-y-1/2
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-white/90
                        shadow-md
                        hover:bg-white
                    "
                    aria-label="Next advertisement"
                >
                    <ChevronRight
                        size={22}
                    />
                </button>


                <button
                    type="button"
                    onClick={handleAdClick}
                    className="block w-full"
                >

                    <img
                        src={currentAd.image.url}
                        alt={currentAd.title || "Advertisement"}
                        className="
                            block
                            h-[220px]
                            w-full
                            object-cover
                            sm:h-[280px]
                            md:h-[360px]
                            lg:h-[420px]
                            xl:h-[460px]
                        "
                    />

                </button>


                {ads.length > 1 && (

                    <div className="
                        absolute
                        bottom-3
                        left-1/2
                        flex
                        -translate-x-1/2
                        gap-2
                    ">

                        {ads.map((ad, index) => (

                            <button
                                key={ad._id || index}
                                type="button"
                                onClick={() =>
                                    setCurrentIndex(index)
                                }
                                className={`
                                    h-2
                                    rounded-full
                                    transition-all
                                    ${
                                        index === currentIndex
                                            ? "w-6 bg-white"
                                            : "w-2 bg-white/60"
                                    }
                                `}
                                aria-label={`Go to advertisement ${index + 1}`}
                            />

                        ))}

                    </div>

                )}

            </div>

        </section>
    );
};


export default HeroAd;