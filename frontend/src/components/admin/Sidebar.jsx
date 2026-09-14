import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Package,
    Layers,
    History,
    Tags,
    Boxes,
    ShoppingCart,
    CreditCard,
    Truck,
    RotateCcw,
    TicketPercent,
    Megaphone,
    Users,
    Star,
    Headphones,
    User
} from "lucide-react";


const menuGroups = [

    {
        title: null,
        items: [
            {
                name: "Dashboard",
                path: "/admin",
                icon: LayoutDashboard
            }
        ]
    },

    {
        title: "CATALOG",
        items: [
            {
                name: "Categories",
                path: "/admin/categories",
                icon: Tags
            },
            {
                name: "Products",
                path: "/admin/products",
                icon: Package
            },
            {
                name: "Product Variants",
                path: "/admin/product-variants",
                icon: Layers
            }
        ]
    },

    {
        title: "INVENTORY",
        items: [

            {
                name: "Manage Stock",
                path: "/admin/inventory",
                icon: Boxes
            },

            {
                name: "Transaction History",
                path: "/admin/transactions",
                icon: History
            }
        ]
    },

    {
        title: "SALES",
        items: [
            {
                name: "Orders",
                path: "/admin/orders",
                icon: ShoppingCart
            },
            {
                name: "Payments",
                path: "/admin/payments",
                icon: CreditCard
            },
            {
                name: "Shipments",
                path: "/admin/shipments",
                icon: Truck
            },
            {
                name: "Returns",
                path: "/admin/returns",
                icon: RotateCcw
            }
        ]
    },

    {
        title: "MARKETING",
        items: [
            {
                name: "Coupons",
                path: "/admin/coupons",
                icon: TicketPercent
            },
            {
                name: "Advertisements",
                path: "/admin/advertisements",
                icon: Megaphone
            }
        ]
    },

    {
        title: "CUSTOMERS",
        items: [
            {
                name: "Customers",
                path: "/admin/customers",
                icon: Users
            },
            {
                name: "Reviews",
                path: "/admin/reviews",
                icon: Star
            }
        ]
    },

    {
        title: "SUPPORT",
        items: [
            {
                name: "Support",
                path: "/admin/support",
                icon: Headphones
            }
        ]
    }

];


const Sidebar = () => {

    return (
        <aside className="
            flex
            h-full
            flex-col
            px-3
            py-5
        ">

            {/* Navigation */}

            <nav className="
                flex-1
                space-y-6
                overflow-y-auto
            ">

                {menuGroups.map((group) => (

                    <div key={group.title || "dashboard"}>

                        {group.title && (
                            <p className="
                                mb-2
                                px-3
                                text-[11px]
                                font-semibold
                                tracking-wider
                                text-gray-400
                            ">
                                {group.title}
                            </p>
                        )}


                        <div className="space-y-1">

                            {group.items.map((item) => {

                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === "/admin"}
                                        className={({ isActive }) => `
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-sm
                                            font-medium
                                            transition
                                            ${
                                                isActive
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            }
                                        `}
                                    >

                                        <Icon size={18} />

                                        <span>
                                            {item.name}
                                        </span>

                                    </NavLink>
                                );

                            })}

                        </div>

                    </div>

                ))}

            </nav>


            {/* Profile */}

            <div className="
                mt-4
                border-t
                border-gray-200
                pt-4
            ">

                <NavLink
                    to="/admin/profile"
                    className={({ isActive }) => `
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition
                        ${
                            isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }
                    `}
                >

                    <User size={18} />

                    <span>
                        Profile
                    </span>

                </NavLink>

            </div>

        </aside>
    );
};


export default Sidebar;