import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";


const PromoAdCarousel = ({ ads = [] }) => {

    const navigate = useNavigate();

    const containerRef = useRef(null);


    useEffect(() => {

        if (ads.length <= 1) {
            return;
        }


        const interval = setInterval(() => {

            const container =
                containerRef.current;


            if (!container) {
                return;
            }


            const firstCard =
                container.firstElementChild;


            if (!firstCard) {
                return;
            }


            const scrollAmount =
                firstCard.offsetWidth + 16;


            const reachedEnd =
                container.scrollLeft +
                container.clientWidth >=
                container.scrollWidth - 5;


            if (reachedEnd) {

                container.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });

            }
            else {

                container.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth"
                });

            }

        }, 4000);


        return () => clearInterval(interval);

    }, [ads.length]);


    if (!ads.length) {
        return null;
    }


    const scrollLeft = () => {

        containerRef.current?.scrollBy({
            left: -400,
            behavior: "smooth"
        });

    };


    const scrollRight = () => {

        containerRef.current?.scrollBy({
            left: 400,
            behavior: "smooth"
        });

    };


    const handleAdClick = (ad) => {

        if (ad.productVariantId) {

            navigate(
                `/product-variants/${ad.productVariantId}`
            );

        }

    };


    return (
        <section className="relative w-full">

            <button
                type="button"
                onClick={scrollLeft}
                className="
                    absolute
                    left-2
                    top-1/2
                    z-10
                    flex
                    h-9
                    w-9
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-md
                "
                aria-label="Previous promotions"
            >
                <ChevronLeft size={20} />
            </button>


            <div
                ref={containerRef}
                className="
                    flex
                    gap-4
                    overflow-x-auto
                    scroll-smooth
                    px-12
                    scrollbar-hide
                "
            >

                {ads.map((ad, index) => (

                    <button
                        key={ad._id || index}
                        type="button"
                        onClick={() =>
                            handleAdClick(ad)
                        }
                        className="
                            min-w-[85%]
                            overflow-hidden
                            rounded-lg
                            md:min-w-[48%]
                            lg:min-w-[32%]
                            xl:min-w-[24%]
                        "
                    >

                        <img
                            src={ad.image.url}
                            alt={
                                ad.title ||
                                "Promotional advertisement"
                            }
                            className="
                                block
                                aspect-[16/7]
                                w-full
                                object-cover
                            "
                        />

                    </button>

                ))}

            </div>


            <button
                type="button"
                onClick={scrollRight}
                className="
                    absolute
                    right-2
                    top-1/2
                    z-10
                    flex
                    h-9
                    w-9
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-md
                "
                aria-label="Next promotions"
            >
                <ChevronRight size={20} />
            </button>

        </section>
    );
};


export default PromoAdCarousel;