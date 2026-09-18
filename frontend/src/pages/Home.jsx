import { useEffect, useState } from "react";

import {
    getActiveAdvertisements
} from "../services/advertisementService";

import HeroAd from "../components/customer/home/HomeAd";
import PromoAdCarousel from "../components/customer/home/PromoAdCarousel";


const Home = () => {

    const [heroAds, setHeroAds] = useState([]);
    const [promoAds, setPromoAds] = useState([]);

    useEffect(() => {

        const loadHomeAds = async () => {

            try {

                const [
                    heroResponse,
                    promoResponse
                ] = await Promise.all([

                    getActiveAdvertisements(
                        "HOME",
                        "HOME_HERO"
                    ),

                    getActiveAdvertisements(
                        "HOME",
                        "HOME_AUTO_SCROLL"
                    )

                ]);


                setHeroAds(
                    heroResponse.data?.advertisements || []
                );

                setPromoAds(
                    promoResponse.data?.advertisements || []
                );

            }
            catch (error) {

                console.error(
                    "Failed to load home advertisements:",
                    error
                );

            }

        };


        loadHomeAds();

    }, []);


    return (

        <div className="w-full">

            <HeroAd
                ads={heroAds}
            />

            <PromoAdCarousel
                ads={promoAds}
            />

        </div>

    );
};


export default Home;
