import { Outlet } from "react-router-dom";

import Navbar from "../components/customer/Navbar";
import Hoverbar from "../components/customer/Hoverbar";


const CustomerLayout = () => {

    return (
        <div className="min-h-screen">

            <Navbar />

            <Hoverbar />

            <main>
                <Outlet />
            </main>

        </div>
    );
};


export default CustomerLayout;