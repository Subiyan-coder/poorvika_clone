import { Outlet } from "react-router-dom";

import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";


const AdminLayout = () => {

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Navbar */}

            <header className="
                fixed
                left-0
                right-0
                top-0
                z-50
            ">
                <Navbar />
            </header>


            <div className="flex w-full min-w-0 pt-16">

                {/* Sidebar */}

                <aside className="
                    fixed
                    bottom-0
                    left-0
                    top-16
                    hidden
                    w-64
                    border-r
                    border-gray-200
                    bg-white
                    lg:block
                ">
                    <Sidebar />
                </aside>


                {/* Content */}

                <main className="
                    min-h-[calc(100vh-4rem)]
                    min-w-0
                    flex-1
                    lg:ml-64
                ">
                    <div className="
                        mx-auto
                        w-full
                        max-w-7xl
                        min-w-0
                        px-6
                        py-6
                    ">
                        <Outlet />
                    </div>
                </main>

            </div>

        </div>
    );
};


export default AdminLayout;