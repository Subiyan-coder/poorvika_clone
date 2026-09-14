import { Outlet } from "react-router-dom";

import Navbar from "../components/customer/Navbar";


const CustomerLayout = () => {

    return (
        <div className="min-h-screen">

            <Navbar />

            <main>
                <Outlet />
            </main>

        </div>
    );
};


export default CustomerLayout;